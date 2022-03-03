import { RarityImage } from "./RarityImage";
import { Box, Container, Grid, Typography } from "@mui/material";
import React from "react";

export default function Rarity() {
	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<RarityImage />

			<br />
		</Container>
	);
}
