import { Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useWeb3 } from "../contexts/Web3Context";
import { toast } from "react-toastify";
import { ethers } from "ethers";

export default function Experience() {
	const { contract, signer, address, farmContract, testNFTFarm, provider } = useWeb3();
	const [nftBalance, setNFTBalance] = useState();
	const [stakeBalance, setStakeBalance] = useState();
	const [idList, setIdList] = useState([]);
	const [baseURI, setBaseURI] = useState();
	const [stakedId, setStakedId] = useState([]);
	const tokenIdRef = useRef();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!signer) return;
		async function init() {
			const balance = await contract.balanceOf(address);
			const staked = await farmContract.getStakedToken(address);
			const baseUri = await contract.getBaseURI();
			await getStakedListByOwner();
			await getTokenListByOwner();
			setBaseURI(baseUri);
			setStakeBalance(staked.length);
			setNFTBalance(balance.toString());
			setLoading(false);
		}
		init();
	}, []);
	const getStakedListByOwner = async () => {
		const stakedId = await farmContract.getStakedToken(address);
		let idArray = [];
		stakedId.forEach((tokenId) => idArray.push(tokenId.toString()));

		setStakedId(idArray);
	};
	const getTokenListByOwner = async () => {
		const balance = await contract.balanceOf(address);
		if (balance > 0) {
			const ownedNFT = await contract.getTokensOfOwner(address);
			let idArray = [];
			ownedNFT.forEach((tokenId) => idArray.push(tokenId.toString()));

			setIdList(idArray);
		}
	};
	const onImageClick = (e, id) => {
		console.log(id);
		if (stakedId.findIndex((ids) => ids === id) === -1) {
			stakeNFT(parseInt(id));
		} else {
			unstakeNFT(parseInt(id));
		}
	};
	const stakeNFT = async (id) => {
		const contractWithSigner = contract.connect(signer);
		const tx = await contractWithSigner.approve(testNFTFarm, tokenIdRef.current.value);

		await toast.promise(waitForTransaction(tx.hash), {
			pending: "Approving Stake",
			success: "Approved",
			error: "Error getting Approval",
		});
		const farmWithSigner = farmContract.connect(signer);
		const farmTx = await farmWithSigner.stake(tokenIdRef.current.value);
		const stake = await toast.promise(waitForTransaction(farmTx.hash), {
			pending: "Staking",
			success: "Staked!",
			error: "Error Stake",
		});
		const staked = await farmContract.getStakedToken(address);
		const balance = await contract.balanceOf(address);
		setStakeBalance(staked.length);
		setNFTBalance(balance.toString());
		getStakedListByOwner();
		getTokenListByOwner();
	};
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	const unstakeNFT = async (id) => {
		const farmWithSigner = farmContract.connect(signer);
		const tx = await farmWithSigner.unstake(id);
		const unstake = await toast.promise(waitForTransaction(tx.hash), {
			pending: "unStaking",
			success: "unStaked!",
			error: "Error Stake",
		});
		const staked = await farmContract.getStakedToken(address);
		const balance = await contract.balanceOf(address);
		setStakeBalance(staked.length);
		setNFTBalance(balance.toString());
		getStakedListByOwner();
		getTokenListByOwner();
	};
	const waitForTransaction = async (tx) => {
		let confirmedApprove = null;
		return new Promise(async (res, rej) => {
			while (confirmedApprove === undefined || confirmedApprove === null) {
				confirmedApprove = await provider.getTransactionReceipt(tx);
				await sleep(1000);
				console.log(confirmedApprove);
			}
			res(confirmedApprove);
		});
	};
	if (loading) return <></>;
	return (
		<Container sx={{ width: { sx: "100vw", md: "90vw", marginTop: "50px" } }}>
			<Box>
				<Grid container display={"flex"} justifyContent="space-between" sx={{ borderRadius: "20px", mt: 1 }}>
					<Grid
						item
						xs={12}
						sm={12}
						display={"flex"}
						alignItems={"center"}
						sx={{ mt: { xs: 10, sm: 0 }, flexDirection: "column" }}
						justifyContent="center"
						className="grow"
					>
						<Grid item>
							<Typography>You Own: {nftBalance} NFT</Typography>
							<Typography>You Staked: {stakeBalance} NFT</Typography>
							<Typography>Click Image To Stake / Unstake</Typography>
						</Grid>

						<Grid item>
							<Typography sx={{ borderBottom: "3px solid red" }}>Staked</Typography>
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
					<Grid container spacing={3}>
						{idList.map((id) => {
							return (
								<Grid
									item
									display={"flex"}
									sx={{
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}
									className="growmore"
									key={id}
								>
									<img
										width={150}
										height={150}
										onClick={(e) => onImageClick(e, id)}
										src={`${baseURI}${id}.png`}
										alt="NFTs"
									></img>
									ID - {id}
								</Grid>
							);
						})}
						{stakedId.map((id) => {
							return (
								<Grid
									item
									display={"flex"}
									sx={{
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}
									className="growmore"
									key={id}
								>
									<img
										width={150}
										height={150}
										onClick={(e) => onImageClick(e, id)}
										src={`${baseURI}${id}.png`}
										alt="NFTs"
										style={{ border: "3px solid red" }}
									></img>
									ID - {id}
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			</Box>

			<br />
		</Container>
	);
}
