import supabase from "./supabaseClient";

export const handlerInsertSupabase = async (table, dataInsert) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert([dataInsert])
      .select();

    if (error) {
      throw new Error(`Error inserting data into ${table}: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error during insert operation: ${error.message}`);
    // throw new Error(
    //   `Unexpected error during insert operation: ${error.message}`
    // );
  }
};

export const handlerUpdateBD = async (table, column, id) => {
  try {
    const { error } = await supabase.from(table).update(column).eq("id", id);

    if (error) {
      throw new Error(`Error inserting data into ${table}: ${error.message}`);
    }
  } catch (error) {
    console.error(`Unexpected error during insert operation: ${error.message}`);
  }
};

export const fetchSupabaseDB = async (table, query) => {
  const setQuery = query !== "" ? query : "*";

  try {
    // Comenzar a mostrar el indicador de carga
    const { data, error } = await supabase.from(table).select(setQuery);

    if (error) {
      throw new Error(`Error fetching data from ${table}: ${error.message}`);
    }

    return { data: data, error: null };
  } catch (error) {
    console.error(`Unexpected error during fetch operation: ${error.message}`);
    // throw new Error(
    //   `Unexpected error during fetch operation: ${error.message}`
    // );
  }
};

export const fetchSpacingAll = async (userID) => {
  // Fetch all spacings where the user is either responsible or part of the users_id array
  const { data: spacings, error: spacingError } = await supabase
    .from("table_spacing")
    .select(
      `
      id,
      name_spacing,
      user_responsible_id,
      users_id,
      is_active,
      lists:table_lists (
        id,
        name_list,
        users_id,
        is_active,
        spacing:table_spacing (
          name_spacing
        ),
        user_responsible_id,
        tasks:table_tasks (
          id,
          user_id,
          name_task,
          description_task,
          start_date,
          end_date,
          time_task,
          list_id,
          is_active,
          status:table_status_taks (
            id,
            status_name
          )
        )
      )
    `
    )
    .or(`user_responsible_id.eq.${userID},users_id.cs.{${userID}}`);

  if (spacingError) {
    return { data: null, error: spacingError };
  }

  // Filter data according to the user's role (responsible or not) and list is_active status
  const filteredData = spacings
    .map((spacing) => {
      const isResponsibleForSpacing = spacing.user_responsible_id === userID;

      // Filter lists by is_active status
      spacing.lists = spacing.lists.filter((list) => list.is_active);

      // If the user is not responsible for the spacing, filter the lists and tasks accordingly
      if (!isResponsibleForSpacing) {
        spacing.lists = spacing.lists.filter((list) =>
          list.users_id.includes(userID)
        );
        spacing.lists.forEach((list) => {
          list.tasks = list.tasks.filter(
            (task) => task.user_id === userID && task.is_active
          );
        });
      }

      // Only include spacings that have lists or tasks visible to the user
      if (spacing.lists.length > 0) {
        return spacing;
      }

      return null;
    })
    .filter(Boolean); // Remove any null spacings

  return { data: filteredData, error: null };
};

export const fetchTasksForList = async (listID, userID) => {
  // Paso 1: Obtener la información del espacio relacionado con la lista
  const { data: spacingInfo, error: spacingError } = await supabase
    .from("table_lists")
    .select("user_responsible_id")
    .eq("id", listID); // Filtrar por el ID de la lista

  if (spacingError) {
    console.error("Error fetching spacing info:", spacingError);
    return { data: null, error: spacingError };
  }

  // Paso 2: Determinar si el usuario es responsable de alguna de las entradas
  const isResponsible = spacingInfo.some(
    (spacing) => spacing.user_responsible_id === userID
  );

  // Paso 3: Construir la consulta de tareas basada en la responsabilidad del usuario
  const taskQuery = supabase
    .from("table_tasks")
    .select(
      `
        id,
        name_task,
        description_task,
        start_date,
        end_date,
        time_task,
        list_id,
        is_active,
        status: table_status_taks (
          id,
          status_name
        ),
        priority: table_priority_task (
          id,
          priority_name
        ),
        user: table_users (
          id,
          first_name,
          last_name
        ),
        list: table_lists (
          id,
          name_list
        )
      `
    )
    .eq("list_id", listID)
    .eq("is_active", true);

  if (!isResponsible) {
    taskQuery.eq("user_id", userID);
  }

  const { data: tasks, error: taskError } = await taskQuery;

  if (taskError) {
    console.error("Error fetching tasks:", taskError);
    return { data: null, error: taskError };
  }

  return { data: tasks, error: null };
};

export const postInsertSpacing = async ({ postData }) => {
  const { data, error } = await supabase
    .from("table_spacing")
    .insert([postData])
    .select();

  if (error) {
    console.error("Error inserting data:", error);
    return;
  }

  console.log("Data inserted successfully:", data);
};
