import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
export function RarityImage({}) {
	return (
		<Box>
			<Grid
				container
				display={"flex"}
				justifyContent="space-between"
				sx={{
					borderRadius: "20px",
					mt: 1,
				}}
			>
				<Grid
					item
					xs={12}
					sm={12}
					display={"flex"}
					alignItems={"center"}
					sx={{
						mt: {
							xs: 10,
							sm: 0,
						},
					}}
					justifyContent="center"
					className="grow"
				>
					<img
						style={{
							borderRadius: "20px 0px 20px 0px",
							verticalAlign: "middle",
							width: "90vw",
						}}
						width={"auto"}
						src="/img/rarity.png"
						alt="showcase"
					></img>
				</Grid>
			</Grid>
		</Box>
	);
}
