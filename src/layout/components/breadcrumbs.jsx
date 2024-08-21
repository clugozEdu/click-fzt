import { useEffect, useState } from "react";
import { Breadcrumbs, Typography, Box } from "@mui/material";
import { Grid } from "@mui/material";
import { FolderOpen, List } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import supabase from "../../supabaseClient";

function NavLinksBreadcrumbs() {
  const { listId, spacingId } = useParams();
  const [nameList, setNameList] = useState("");
  const [nameSpacing, setNameSpacing] = useState("");
  const [breadcrumb, setBreadcrumb] = useState([]);

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
    const breadcrumbItems = [];
    if (nameSpacing) {
      breadcrumbItems.push({
        label: nameSpacing,
        icon: <FolderOpen sx={{ mr: 1, color: "text.secondary" }} />,
      });
    }
    if (nameList) {
      breadcrumbItems.push({
        label: nameList,
        icon: <List sx={{ mr: 1, color: "text.secondary" }} />,
      });
    }
    setBreadcrumb(breadcrumbItems);
  }, [nameList, nameSpacing]);

  return (
    <Grid container sx={{ mt: 1 }}>
      <Grid item sx={{ mb: 1 }}>
        <Breadcrumbs>
          {breadcrumb.map((item, index) => (
            <Box key={index} display="flex" alignItems="center">
              {item.icon}
              <Typography variant="body2" color="black">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Breadcrumbs>
      </Grid>
    </Grid>
  );
}

export default NavLinksBreadcrumbs;
