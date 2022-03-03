import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import abi from "./nftabi.json";
import farm from "./farmabi.json";
const Web3Provider = createContext();
export const useWeb3 = () => {
	return useContext(Web3Provider);
};
const Web3Context = ({ children }) => {
	const [address, setAddress] = useState();
	const [signer, setSigner] = useState();
	const [provider, setProvider] = useState();
	const [contract, setContract] = useState();
	const [loading, setLoading] = useState(true);
	const [farmContract, setFarmContract] = useState();
	const testNFT = "0x0AC3D84C25B809E3cBb45c7D37363c0CeD4Ef62D";
	const testNFTFarm = "0xE18E4e4190e60Dce00C77043Fc257452f9d6a253";
	const NFTAddress = ""; //0xa299197bA18Aa18886B1580140342FfAf12d3874 or New NFT Mainnet Address
	const web3Modal = new Web3Modal({
		network: "testnet", // optional
		cacheProvider: false, // optional
		providerOptions, // required
	});
	const logout = () => {
		setAddress();
		setSigner();
		setProvider();
		setContract();
	};
	const login = async () => {
		//=============Etherjs for testnet==================
		const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
		setProvider(_provider);
		//Pop up metamask
		await _provider.send("eth_requestAccounts", []);
		const _signer = _provider.getSigner();
		setSigner(_signer);
		const address = await _signer.getAddress();
		const _contract = new ethers.Contract(testNFT, abi, _signer);
		const _farmContract = new ethers.Contract(testNFTFarm, farm, _signer);

		setAddress(address);
		setContract(_contract);
		setFarmContract(_farmContract);
		setLoading(false);
		//===================Web3Modal in Mainnet Only===================
		/* web3Modal.clearCachedProvider();
		const instance = await web3Modal.connect();
		const _provider = new ethers.providers.Web3Provider(instance);

		const _signer = _provider.getSigner();
		console.log(_signer);
		setProvider(_provider);
		setSigner(_signer);
		setAddress(await _signer.getAddress());
		const _contract = new ethers.Contract(NFTAddress, abi, _signer);
		setContract(_contract);
		_provider.on("accountsChanged", (accounts) => {
			console.log(accounts);
		});

		// Subscribe to chainId change
		_provider.on("chainChanged", (chainId) => {
			console.log(chainId);
		});

		// Subscribe to provider connection
		_provider.on("connect", (info) => {
			console.log(info);
		});

		// Subscribe to provider disconnection
		_provider.on("disconnect", (error) => {
			console.log(error);
		}); */
	};
	useEffect(() => {
		//Check is already connected and set address details
		login();
	}, []);

	const value = { login, logout, signer, provider, NFTAddress, testNFT, testNFTFarm, contract, address, farmContract };

	return <Web3Provider.Provider value={value}>{!loading && children}</Web3Provider.Provider>;
};
const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider, // required
		options: {
			rpc: {
				56: "https://bsc-dataseed.binance.org",
			},
			network: "binance",
			chainId: 56,
			infuraId: "1b47bf0a6d0b4f1893f3c1ea5c8f9501", // required
		},
	},
};

export default Web3Context;
