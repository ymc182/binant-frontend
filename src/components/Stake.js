import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { CollectionsBookmarkRounded } from "@mui/icons-material";
export default function Experience() {
	const { contract, signer, address, farmContract, testNFTFarm, provider } = useWeb3();
	const [nftBalance, setNFTBalance] = useState();
	const [stakeBalance, setStakeBalance] = useState();
	const tokenIdRef = useRef();
	useEffect(() => {
		if (!signer) return;
		async function getBalance() {
			const balance = await contract.balanceOf(address);
			const staked = await farmContract.getStakedToken(address);
			setStakeBalance(staked.length);
			setNFTBalance(balance.toString());
		}
		getBalance();
	}, []);

	const stakeNFT = async () => {
		const contractWithSigner = contract.connect(signer);
		const tx = await contractWithSigner.approve(testNFTFarm, tokenIdRef.current.value);
		console.log("tx:", tx);
		let confirmedApprove = null;
		const approvePromise = new Promise(async (res, rej) => {
			while (confirmedApprove === undefined || confirmedApprove === null) {
				confirmedApprove = await provider.getTransactionReceipt(tx.hash);
				await sleep(1000);
				console.log(confirmedApprove);
			}
			res(confirmedApprove);
		});
		await toast.promise(approvePromise, {
			pending: "Approving Stake",
			success: "Approved",
			error: "Error getting Approval",
		});
		const farmWithSigner = farmContract.connect(signer);
		const stake = toast.promise(farmWithSigner.stake(tokenIdRef.current.value), {
			pending: "Staking",
			success: "Staked!",
			error: "Error Stake",
		});
	};
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const unstakeNFT = async () => {
		const farmWithSigner = farmContract.connect(signer);
		const tx = await farmWithSigner.unstake(tokenIdRef.current.value);
		let confirmedApprove = null;
		const approvePromise = new Promise(async (res, rej) => {
			while (confirmedApprove === undefined || confirmedApprove === null) {
				confirmedApprove = await provider.getTransactionReceipt(tx.hash);
				await sleep(1000);
				console.log(confirmedApprove);
			}
			res(confirmedApprove);
		});
		const unstake = toast.promise(approvePromise, {
			pending: "unStaking",
			success: "unStaked!",
			error: "Error Stake",
		});
	};
	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<Box>
				<Grid container display={"flex"} justifyContent="space-between" sx={{ borderRadius: "20px", mt: 1 }}>
					<Grid
						container
						xs={12}
						sm={12}
						display={"flex"}
						alignItems={"center"}
						direction={"column"}
						sx={{ mt: { xs: 10, sm: 0 } }}
						justifyContent="center"
						className="grow"
					>
						<Grid item>
							{" "}
							<Typography>You Own: {nftBalance} NFT</Typography>
							<Typography>You Staked: {stakeBalance} NFT</Typography>
						</Grid>
						<Grid item>
							<TextField
								inputRef={tokenIdRef}
								type="number"
								inputProps={{
									maxLength: 13,
									step: "1",
								}}
								size="small"
								helperText="Token ID"
								defaultValue={0}
								sx={{ width: "80px" }}
							/>
							<Button variant="outlined" onClick={stakeNFT}>
								Test Stake
							</Button>
							<Button variant="outlined" onClick={unstakeNFT}>
								unStake
							</Button>
						</Grid>
						{/* 	<img
							style={{
								border: "6px solid #F9BA55",
								borderRadius: "20px 0px 20px 0px",
								verticalAlign: "middle",
								width: "360px",
							}}
							width={"auto"}
							src="/img/preview.gif"
							alt="showcase"
						></img> */}
					</Grid>
				</Grid>
			</Box>

			<br />
		</Container>
	);
}
