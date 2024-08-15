import { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import supabase from "../../supabaseClient";

function NavLinksBreadcrumbs() {
  const { listId, spacingId } = useParams();
  const [nameList, setNameList] = useState("");
  const [nameSpacing, setNameSpacing] = useState("");
  const [breadcrumb, setBreadcrumb] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (spacingId) {
          const { data: spacingData, error: spacingError } = await supabase
            .from("table_spacing")
            .select("name_spacing")
            .eq("id", spacingId);

          if (spacingError) {
            throw spacingError;
          }

          if (spacingData && spacingData.length > 0) {
            setNameSpacing(spacingData[0].name_spacing);
          }
        }

        if (listId) {
          const { data: listData, error: listError } = await supabase
            .from("table_lists")
            .select("name_list")
            .eq("id", listId);

          if (listError) {
            throw listError;
          }

          if (listData && listData.length > 0) {
            setNameList(listData[0].name_list);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [listId, spacingId]);

  useEffect(() => {
    if (nameSpacing && nameList) {
      setBreadcrumb(`${nameSpacing} / ${nameList}`);
    } else if (nameSpacing) {
      setBreadcrumb(nameSpacing);
    } else if (nameList) {
      setBreadcrumb(nameList);
    } else {
      setBreadcrumb("");
    }
  }, [nameList, nameSpacing]);

  return (
    <Grid container>
      <Grid item sx={{ mb: 2 }}>
        <Breadcrumbs>
          {breadcrumb && (
            <Typography variant="h6" color="black">
              {breadcrumb}
            </Typography>
          )}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

export default NavLinksBreadcrumbs;
