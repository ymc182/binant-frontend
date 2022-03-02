import { Box, Button, Container, Grid, IconButton, Typography, styled } from "@mui/material";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PublicIcon from "@mui/icons-material/Public";
import { useWeb3 } from "../contexts/Web3Context";
import { ethers } from "ethers";
export default function MintHeader() {
	const [nftSupply, setNftSupply] = React.useState(null);
	const { contract, signer, address } = useWeb3();

	const mint = async () => {
		const contractWithSigner = contract.connect(signer);
		console.log(address);
		console.log(contract);
		const tx = await contractWithSigner.mint(address, 1, { value: ethers.utils.parseEther("0.1") });
		console.log(tx);
	};

	const StyledButton = styled(Button)`
		color: #fff;
		width: 180px;
		height: 60px;
		padding: 6px 18px;
		font-size: 18px;
		border: 3px solid #fff;
		border-radius: 20px;
		&:hover {
			color: #fff;
			border: 3px solid #fff;
		}
		&:focus {
			border: 3px solid #fff;
		}
		border-radius: 0px;
	`;

	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<Box>
				<Grid container display={"flex"} justifyContent="space-between" sx={{ borderRadius: "20px", mt: 15 }}>
					<Grid item xs={12} sm={1} sx={{}}>
						<Grid container display={"flex"}>
							<Grid item>
								<a href="https://discord.com/invite/YNNu7aM2BH">
									<IconButton className="growmore" sx={{ fontSize: "300%" }}>
										<span className="iconify" data-icon="simple-icons:discord"></span>
									</IconButton>
								</a>
							</Grid>
							<Grid item>
								<a href="https://www.instagram.com/goodfortunefelines/">
									<IconButton>
										<InstagramIcon className="growmore" sx={{ fontSize: "200%" }} />
									</IconButton>
								</a>
							</Grid>

							<Grid item>
								<a href="https://twitter.com/goodfortuneNFT">
									<IconButton>
										<TwitterIcon className="growmore" sx={{ fontSize: "200%" }} />
									</IconButton>
								</a>
							</Grid>
							<Grid item>
								<a href="https://www.goodfortunefelines.xyz/">
									<IconButton>
										<PublicIcon className="growmore" sx={{ fontSize: "200%" }} />
									</IconButton>
								</a>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={6} sx={{}}>
						<Grid
							className="animate__animated animate__zoomIn"
							container
							display="flex"
							justifyContent={"space-between"}
							direction="column"
							sx={{ height: "350px" }}
						>
							<Grid item>
								<Typography className="grow" variant="h3" fontWeight={"900"} /* sx={{ textShadow: "2px 2px 6px" }} */>
									BINANTS NFT
								</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">A collection of 3333 RPG Play-2-Earn unique NFTs</Typography>
							</Grid>
							<Grid item>
								<Typography variant="subtitle1">Launching 28/02 5pm UTC</Typography>
							</Grid>
							<Grid item>
								<StyledButton onClick={mint} className="grow" variant="outlined" size="large">
									Mint Now
								</StyledButton>
							</Grid>

							<Grid item>Minted {nftSupply} / 3333</Grid>
						</Grid>
					</Grid>
					<Grid
						item
						xs={12}
						sm={5}
						display={"flex"}
						alignItems={"center"}
						sx={{ mt: { xs: 10, sm: 0 } }}
						justifyContent="center"
						className="grow"
					>
						<img
							style={{
								borderRadius: "0px 20px 0px 20px",
								verticalAlign: "middle",
								height: "350px",
							}}
							width={"auto"}
							src="/img/catheader.png"
							alt="showcase"
							className="animate__animated animate__bounce "
						></img>
					</Grid>
				</Grid>
			</Box>

			<br />
		</Container>
	);
}
