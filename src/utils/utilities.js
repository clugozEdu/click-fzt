// function to get color and name for user
const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

// function to callback stringColor for return avatar user and color
export const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

export const priorityColors = {
  Alta: "#cf940a",
  Urgente: "#b13a41",
  Media: "#4466ff",
  Baja: "#87909e",
};

export const statusColors = {
  Backlog: "#2f4a63", // Dark Slate Grey
  "En Progreso": "#0d1f2d", // Gold
  Realizado: "#008844", // Dark Green
};

export const backStatusColor = {
  Backlog: "#2f4a63", // Dark Slate Grey
  "En Progreso": "#0d1f2d", // Gold
  Realizado: "#008844", // Dark Green
};

export const getColorsScheme = (contextName, objectScheme) => {
  return objectScheme[contextName] || "default";
};

export const convertHours = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

export const formatDate = (dateString) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} ${year}`;
};
