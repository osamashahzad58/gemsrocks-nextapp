"use client"

import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Landingpage/navbar';
import TradingViewChart from '@/app/components/TradingviewChart';
import { formatEthinDollar, formatMarketCap, getFormatedWeb3Address, handleShare } from '@/app/helpers';
import { ethToDollarConverter } from '@/app/services';
import socket, { useSocketEvents } from '@/app/sockets';
import moment from 'moment';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Dropdown, Modal, Offcanvas, ProgressBar, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";

const page = () => {
    const { id } = useParams();
    // const { account } = useWeb3React();
    const token = localStorage?.getItem("accessToken");
    const userId = localStorage?.getItem("userId");
    // const web3 = useWeb3();
    // const { BalanceHook } = Balance();
    // const { BalanceOfRockHook } = BalanceOfRock();
    // const { sellTokenHook } = SellToken();
    // const { rockAllowance } = useRockAllowance();
    const [copied, setCopied] = useState(false);
    const [rockBalance, setRockBalance] = useState("0");
    const [tradeAmount, setTradeAmount] = useState("");
    const [sellAmount, setSellAmount] = useState("");
    const [postComment, setPostComment] = useState("");
    const [updateComment, setUpdateComment] = useState("");
    const [updateId, setUpdateId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [listComment, setListComment] = useState<any>("");
    console.log(listComment, "listComment......");

    const [detail, setDetail] = useState<any>(null);
    const [lastTime, setLastTime] = useState(null);
    const [commentDisable, setCommentDisable] = useState(false);
    const [loader, setLoader] = useState(false);
    const [likeData, setLikeData] = useState<any>([]);
    // const { buyTradeTransaction, getTotalMintedGems } = useBuyPoolHook()
    // const rockApprove = useRockApprove(detail?.contractAddress)
    const [isTransactionOcurring, setIsTransactionOcurring] = useState(false);
    const [percentage, setPercentage] = useState<number>(0);
    const [kingOfDesertPercentage, setKingOfDesertPercentage] = useState<number>(0)
    const [isKingOfDesert, setIsKingOfDesert] = useState(false)
    const [marketCap, setMarketCap] = useState<number>(0.00);
    const [tokenPrice, setTokenPrice] = useState<number>(0.00);
    const [rockGet, setRockGet] = useState("");
    const [remainingGems, setRemainingGems] = useState("");
    const [gemGet, setGemGet] = useState("");
    const [uniSwapPoolAddreess, setUniSwapPoolAddress] = useState<string>("")
    const projectTicker = detail?.ticker;
    const socketEvent = `ETH/${projectTicker}-${id}`
    const [initialData, setInitialData] = useState([]);
    const [liveData, setLiveData] = useState([]);
    const [topHolder, setTopHolder] = useState([]);
    const checkLinks = !!detail?.telegram || !!detail?.twitter || !!detail?.youtube || !!detail?.discord || !!detail?.website;
    const [ethBalance, setEthBalance] = useState(null);
    const [uniSwapPoolContractAddress, setUniSwapPoolContractAddress] = useState('')
    const [isOnUniSwap, setIsOnUniSwap] = useState(false);
    const [bondingCurveWallet, setBondingCurveWallet] = useState("");
    const [ethPrice, setEthPrice] = useState(0);
    const [loaderMessage, setLoaderMessage] = useState('');
    // const { getV3Quote, rockRelayerTransactions } = useUniswapV3()
    const [iframeSrc, setIframeSrc] = useState("");
    const [iframeKey, setIframeKey] = useState(0);
    const HMEMS_Pair_Address = '0x821ea44beae5de9a279df58feeb2b221cd1ad1b5';
    const [isTokenGraduate, setIsTokenGraduate] = useState(false);

    const events = [
        {
            eventName: "connect",
            handler: () => console.log("Connected to the server"),
        },
        {
            eventName: socketEvent,
            handler: (data: any) => {
                console.log(data, "datadatadatadatadata");

                if (data !== null) {
                    let mc = Number(data?.marketCap);
                    const currentPrice = Number(data?.price)
                    const currentPercentage = +Number(data?.percentage)?.toFixed(2)
                    const currentKOD = +Number(data?.KOD)?.toFixed(2)
                    setMarketCap(mc);
                    setTokenPrice(currentPrice)
                    setPercentage(currentPercentage)
                    setKingOfDesertPercentage(currentKOD)
                    initialData?.length > 0 ? setLiveData(data?.ohlcData) : setInitialData(data?.ohlcData)
                }
            },
        },
        {
            eventName: uniSwapPoolAddreess,
            handler: (data: any) => {
                if (data !== null) {
                    let mc = Number(data?.marketCap);
                    const currentPrice = Number(data?.price)
                    setMarketCap(mc);
                    setTokenPrice(currentPrice)
                }
            },
        },
        {
            eventName: "pingFromServer",
            handler: () => {
                console.log("Received ping from server");
                socket.emit("pongFromClient", { message: "Pong from client" });
            },
        },
        {
            eventName: "error",
            handler: (error: any) => console.error("Connection error:", error),
        },
    ];
    useSocketEvents(events);

    const fetchRemainingEth = async () => {
        // const { balanceOf } = await getTotalMintedGems(detail?.contractAddress);
        // const formattedBalance = web3.utils.fromWei(String(balanceOf), 'ether');
        // setRemainingGems(formattedBalance);
    };

    const fetchEthValue = async () => {
        const ethAmount = await ethToDollarConverter();
        setEthPrice(ethAmount);
    };


    const makeKing = async () => {
        try {
            // const response = await axios.patch(
            //     `${api_url}project/update-project/${detail?._id}`, { kingOfDessertStatus: true }, {
            //     headers: {
            //         "Authorization": `Bearer ${token}`,
            //     },
            // }
            // )
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const markGraduate = async () => {
        try {
            // const response = await axios.patch(
            //     `${api_url}project/graduate-project/${detail?._id}`, { isGraduated: true, pairAddress: uniSwapPoolAddreess, }, {
            //     headers: {
            //         "Authorization": `Bearer ${token}`,
            //     },
            // })
            // if (response) { setIsTokenGraduate(true) }
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    useEffect(() => {
        const isKingOfDessert = async () => {
            if (+kingOfDesertPercentage === 100 && !isKingOfDesert) {
                await makeKing();
            }
        }
        const isProjectGraduated = async () => {
            if (!detail?.isGraduated && +percentage === 100 && uniSwapPoolAddreess) {
                await markGraduate();
            }
        }
        isKingOfDessert()
        isProjectGraduated()
    }, [kingOfDesertPercentage, percentage, uniSwapPoolAddreess])

    const getRockBalaneHandle = async () => {
        // try {
        //     const res = await BalanceOfRockHook(detail?.contractAddress);
        //     setRockBalance(res || 0)
        //     return res;
        // } catch (error) {
        //     console.log(error, "getUserAllowancHandle");
        // }
    }

    // useEffect(() => {
    //     if (account && detail?.contractAddress) {
    //         getRockBalaneHandle();
    //     }
    // }, [account, detail])

    const handleCopy = () => {
        if (detail?.contractAddress) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(detail?.contractAddress)
                    .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    })
                    .catch((err) => { });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = detail?.contractAddress;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error("Failed to copy URL using fallback:", err);
                }
                document.body.removeChild(textArea);
            }
        }
    };


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [show2, setShow2] = useState(false);
    const handleClose2 = () => {
        setShow2(false);
    };
    const handleShow2 = () => setShow2(true);


    const [show12, setShow12] = useState(false);
    const handleClose12 = () => setShow12(false);
    const handleShow12 = (id: any) => {
        setDeleteId(id)
        setShow12(true)
    };


    const [show112, setShow112] = useState(false);
    const handleClose112 = () => setShow112(false);
    const handleShow112 = (text: string, address: string, id: any) => {
        setUpdateComment(text)
        setUpdateId(id)
        setShow112(true);
    };

    useEffect(() => {
        window?.scroll(0, 0);
        fetchEthValue()
    }, []);

    const getRocksDetail = async () => {
        setLoader(true);
        // try {
        //     const { data } = await axios.get(`${api_url}project/get-project/${id}`,);
        //     const updatedTime = data?.data?.createdAt; // Ensure `updatedAt` exists in the response
        //     const lastUpdated = updatedTime
        //         ? getTimeInAges(updatedTime)
        //         : "Unknown time";
        //     setLastTime(lastUpdated);
        //     setDetail(data?.data)
        //     const mc = Number(data?.data?.marketcap);
        //     const currentPrice = Number(data?.data?.price);
        //     setTokenPrice(currentPrice)
        //     setMarketCap(mc);
        //     setIsKingOfDesert(data?.data?.kingOfDessertStatus)
        //     setKingOfDesertPercentage(Number(data?.data?.kodProgress)?.toFixed(2))
        //     setPercentage(Number(data?.data?.bondingProgress)?.toFixed(2));
        //     setLoader(false);
        // } catch (error) {
        //     setLoader(false);
        // }
    };

    const getComments = async () => {
        // try {
        //     const { data } = await axios.get(`${api_url}comment/get-all-project-comments/${id}`, {
        //         headers: {
        //             "Authorization": `Bearer ${token}`,
        //         },
        //     });
        //     setListComment(data?.data?.comments)

        // } catch (error) {
        //     console.error("Error fetching gift collections:", error);
        //     setLoader(false);
        // }
    };

    useEffect(() => {
        if (id) {
            getRocksDetail()
            getComments()
        }
    }, [id]);

    // const handleBuyTrade = async () => {
    //     setLoader(true);
    //     setLoaderMessage("Confirm Buy Transaction");
    //     try {
    //         setIsTransactionOcurring(true)
    //         if (!!uniSwapPoolAddreess) {
    //             const isTXConfirmed = await getUniSwapTxData(true)
    //             if (isTXConfirmed) {
    //                 setTradeAmount("");
    //                 setSellAmount("");
    //                 await fetchEthBalance();
    //                 await getRockBalaneHandle();
    //                 setIsTransactionOcurring(false)
    //                 setLoader(false);
    //                 handleShow2();
    //             }
    //         }
    //         else {
    //             const buyTransaction = await buyTradeTransaction(detail?.contractAddress, tradeAmount);
    //             if (buyTransaction) {
    //                 if (+rockBalance === 0) {
    //                     await buying();
    //                 }
    //                 await fetchEthBalance();
    //                 await fetchRemainingEth();
    //                 await getRockBalaneHandle();
    //                 setTradeAmount("");
    //                 setSellAmount("");
    //                 setIsTransactionOcurring(false)
    //                 setLoader(false);
    //                 handleShow2();
    //             }
    //             else {
    //                 setIsTransactionOcurring(false)
    //                 setLoader(false);
    //             }
    //         }
    //     }
    //     catch (e: any) {
    //         console.log("error", e)
    //         setLoader(false);
    //         setIsTransactionOcurring(false)
    //         if (e?.code === 4001) {
    //             toast?.error("User Rejected!")
    //         } else {
    //             toast?.error("Transaction Failed!")

    //         }
    //     }
    // }

    // const sellRocks = async () => {
    //     try {
    //         const sellTransaction = await sellTokenHook(detail?.contractAddress, Number(sellAmount)?.toFixed(0));
    //         if (sellTransaction) {
    //             await fetchEthBalance();
    //             await fetchRemainingEth();
    //             await getRockBalaneHandle();
    //             setTradeAmount("");
    //             setSellAmount("");
    //             setIsTransactionOcurring(false);
    //             handleShow2();
    //             setLoader(false);
    //         }
    //         else {
    //             setIsTransactionOcurring(false);
    //             setLoader(false);
    //         }
    //     } catch (error: any) {
    //         setIsTransactionOcurring(false)
    //         setLoader(false);
    //         if (error?.code === 4001) {
    //             toast?.error("User Rejected!")
    //         } else {
    //             toast?.error("Transaction Failed!")

    //         }
    //     }
    // }

    const handleSellTrade = async () => {
        setLoader(true);
        try {
            setIsTransactionOcurring(true)
            if (!!uniSwapPoolAddreess) {
                // const checkRockAllowance = await rockAllowance(detail?.contractAddress, true)
                // const userAllowance = Number(checkRockAllowance)?.toFixed(0)
                const userSellAmount = Number(sellAmount)?.toFixed(0)
                // if (+userAllowance > +userSellAmount) {
                //     setLoaderMessage("Confirm Sell Transaction")
                //     const sellTransaction = await getUniSwapTxData(false)
                //     if (sellTransaction) {
                //         await getRockBalaneHandle();
                //         await fetchEthBalance();
                //         setTradeAmount("");
                //         setSellAmount("");
                //         setIsTransactionOcurring(false);
                //         handleShow2();
                //         setLoader(false);
                //     }
                // }
                // else {
                //     setLoaderMessage("Confirm Approve Transaction")
                //     await rockApprove(detail?.contractAddress, true)
                //     setLoaderMessage("Confirm Sell Transaction")
                //     const sellTransaction = await getUniSwapTxData(false)
                //     if (sellTransaction) {
                //         await getRockBalaneHandle();
                //         await fetchEthBalance();
                //         setTradeAmount("");
                //         setSellAmount("");
                //         setIsTransactionOcurring(false);
                //         handleShow2();
                //         setLoader(false);
                //     }
                // }
            }
            else {
                // const checkRockAllowance = await rockAllowance(detail?.contractAddress)
                // const userAllowance = Number(checkRockAllowance)?.toFixed(0)
                // const userSellAmount = Number(sellAmount)?.toFixed(0)
                // if (+userAllowance > +userSellAmount) {
                //     setLoaderMessage("Confirm Sell Transaction")
                //     await sellRocks();
                // } else {
                //     setLoaderMessage("Confirm Approve Transaction")
                //     const rockApproval = await rockApprove(detail?.contractAddress)
                //     if (rockApproval) {
                //         setLoaderMessage("Confirm Sell Transaction")
                //         sellRocks();
                //     }
                //     else {
                //         setIsTransactionOcurring(false)
                //         setLoader(false);
                //     }
                // }
            }
        }
        catch (e: any) {
            console.log("error", e)
            setLoader(false);
            setIsTransactionOcurring(false)
            if (e?.code === 4001) {
                toast?.error("User Rejected!")
            } else {
                toast?.error("Transaction Failed!")

            }
        }
    }


    // const postingComment = async () => {
    //     if (!token) {
    //         toast?.error("Please login to post comment");
    //         return;
    //     }
    //     if (postComment?.length === 0) {
    //         toast?.error("Write Comment First");
    //         return;
    //     }
    //     setCommentDisable(true);
    //     try {
    //         const response = await axios.post(
    //             `${api_url}comment/create-comment`,
    //             {
    //                 projectId: id,
    //                 walletAddress: account,
    //                 comment: postComment
    //             },
    //             {
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         toast.success('Comment posted');
    //         setCommentDisable(false)
    //         setPostComment("");
    //         getComments()
    //     } catch (error) {
    //         console.error('posting', error);
    //         setCommentDisable(false)
    //     }
    // };


    // const updatingComment = async () => {
    //     if (updateComment?.length === 0) {
    //         toast?.error("Write Comment First");
    //         return;
    //     }
    //     setCommentDisable(true);
    //     try {
    //         const response = await axios.patch(
    //             `${api_url}comment/update-comment`,
    //             {
    //                 previousCommentId: updateId,
    //                 walletAddress: account,
    //                 updatedComment: updateComment
    //             },
    //             {
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         getComments()
    //         handleClose112()
    //         toast.success('Comment Updated');
    //         setCommentDisable(false)
    //     } catch (error) {
    //         console.error('posting', error);
    //         setCommentDisable(false)
    //     }
    // };


    // const deleteComment = async () => {
    //     setCommentDisable(true);
    //     try {
    //         const response = await axios.delete(
    //             `${api_url}comment/delete-comment`,
    //             {
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //                 data: {
    //                     commentId: deleteId
    //                 }
    //             }
    //         );
    //         getComments();
    //         toast.success('Comment Deleted');
    //         handleClose12();
    //         setCommentDisable(false);
    //     } catch (error) {
    //         console.error('Error deleting comment:', error);
    //         setCommentDisable(false);
    //     }
    // };


    // useEffect(() => {
    //     const checkTokenEvolve = async () => {
    //         setIsOnUniSwap(true)
    //         const factoryContract = await getFactoryContract(gemsFactoryContract, web3);
    //         const pairAddress = await factoryContract?.methods?.getPair(detail?.contractAddress).call();
    //         setBondingCurveWallet(pairAddress);
    //         if (detail?.pairAddress === HMEMS_Pair_Address?.toLowerCase()) {
    //             setUniSwapPoolContractAddress(`https://app.uniswap.org/explore/pools/arbitrum/${detail?.pairAddress?.toLowerCase()}`)
    //             setUniSwapPoolAddress(detail?.pairAddress?.toLowerCase())
    //             setIsOnUniSwap(false)
    //         }
    //         else {
    //             if (pairAddress) {
    //                 const pairContract = await getPairAddressContract(pairAddress, web3);
    //                 const isEvolve = await pairContract?.methods?.evolved().call();
    //                 if (isEvolve) {
    //                     const uniSwap = await getUniSwapContract(uniSwapContract, web3)
    //                     const isEvolvedOnUniswap = await uniSwap?.methods?.getPool(detail?.contractAddress, wETHContract, 3000).call()
    //                     setUniSwapPoolAddress(isEvolvedOnUniswap?.toLowerCase())
    //                     setUniSwapPoolContractAddress(`https://app.uniswap.org/explore/pools/arbitrum/${isEvolvedOnUniswap}`)
    //                     setIsOnUniSwap(false)
    //                     setIsKingOfDesert(true)
    //                 }
    //                 else {
    //                     setUniSwapPoolAddress("")
    //                     setIsOnUniSwap(false)
    //                 }
    //             }
    //         }
    //     }
    //     if (detail?.contractAddress) {
    //         checkTokenEvolve();
    //     }
    // }, [detail, percentage])

    // useEffect(() => {
    //     const getRockAmount = async () => {
    //         try {
    //             if (!!uniSwapPoolAddreess) {
    //                 const payload = {
    //                     "tokenInAddress": wETHContract,
    //                     "tokenInDecimal": 18,
    //                     "tokenInSymbol": "WETH",
    //                     "tokenInName": "Wrapped Ether",
    //                     "tokenOutAddress": detail?.contractAddress,
    //                     "tokenOutDecimal": 18,
    //                     "tokenOutSymbol": detail?.ticker,
    //                     "tokenOutName": detail?.projectName,
    //                     "amountIn": tradeAmount,
    //                     "recipientAddress": account,
    //                     "isNative": true,
    //                     "isNativeOut": false,
    //                     "chainID": Number(chainId),
    //                     "slippageTolerance": 25
    //                 }
    //                 const response = await getV3Quote(payload)
    //                 const { priceImpact, swapAmount } = response?.data?.data
    //                 const formatteAmount = Number(swapAmount)?.toFixed(2);
    //                 setRockGet(formatteAmount);
    //             }
    //             else {
    //                 const factoryContract = await getFactoryContract(gemsFactoryContract, web3);
    //                 const routerContract = await getToken(gemsRouterContract, web3);
    //                 const address = web3.utils.toChecksumAddress(detail?.contractAddress)
    //                 const pairAddress = await factoryContract?.methods?.getPair(address).call();
    //                 if (!pairAddress) throw new Error("Pair address not found");
    //                 const pairContract = await getPairAddressContract(pairAddress, web3);
    //                 const reserves = await pairContract?.methods?.getReserves()?.call();
    //                 const reserveWETH = reserves?.reserveWETH;
    //                 const rockReserves = reserves?.reserveRock;
    //                 const feeAmountInWei = web3.utils.toWei(tradeAmount, "ether");
    //                 const amountOut = await routerContract?.methods
    //                     ?.getAmountOutWithFee(feeAmountInWei, reserveWETH, rockReserves)
    //                     .call();
    //                 const formatteAmount = web3.utils.fromWei(String(amountOut), 'ether');
    //                 setRockGet(formatteAmount);
    //                 return;
    //             }
    //         } catch (error) {
    //             console.error("Error fetching Rock amount:", error);
    //         }
    //     };

    //     if (tradeAmount && tradeAmount != 0) {
    //         getRockAmount();
    //     } else {
    //         setRockGet("");
    //     }
    // }, [tradeAmount])

    // useEffect(() => {
    //     const getGemAmount = async () => {
    //         try {
    //             if (!!uniSwapPoolAddreess) {
    //                 const payload = {
    //                     "tokenInAddress": detail?.contractAddress,
    //                     "tokenInDecimal": 18,
    //                     "tokenInSymbol": detail?.ticker,
    //                     "tokenInName": detail?.projectName,
    //                     "tokenOutAddress": wETHContract,
    //                     "tokenOutDecimal": 18,
    //                     "tokenOutSymbol": "WETH",
    //                     "tokenOutName": "Wrapped Ether",
    //                     "amountIn": sellAmount,
    //                     "recipientAddress": account,
    //                     "isNative": false,
    //                     "isNativeOut": true,
    //                     "chainID": Number(chainId),
    //                     "slippageTolerance": 25
    //                 }
    //                 const response = await getV3Quote(payload)
    //                 const { priceImpact, swapAmount } = response?.data?.data
    //                 const formatteAmount = Number(swapAmount)?.toFixed(8);
    //                 setGemGet(formatteAmount);
    //                 return;
    //             }
    //             else {
    //                 const factoryContract = await getFactoryContract(gemsFactoryContract, web3);
    //                 const routerContract = await getToken(gemsRouterContract, web3);
    //                 const address = web3.utils.toChecksumAddress(detail?.contractAddress)
    //                 const pairAddress = await factoryContract?.methods?.getPair(address).call();
    //                 if (!pairAddress) throw new Error("Pair address not found");
    //                 const pairContract = await getPairAddressContract(pairAddress, web3);
    //                 const reserves = await pairContract?.methods?.getReserves().call();
    //                 const reserveWETH = reserves?.reserveWETH;
    //                 const rockReserves = reserves?.reserveRock;
    //                 const feeAmountInWei = web3.utils.toWei(sellAmount, "ether");
    //                 const amountOut = await routerContract?.methods
    //                     ?.getAmountOut(feeAmountInWei, rockReserves, reserveWETH)
    //                     .call();
    //                 const formatteAmount = web3.utils.fromWei(String(amountOut), 'ether');
    //                 setGemGet(formatteAmount);
    //                 return;
    //             }
    //         } catch (error) {
    //             console.error("Error fetching Gem amount:", error);
    //         }
    //     };

    //     if (sellAmount && sellAmount != 0) {
    //         getGemAmount();
    //     } else {
    //         setGemGet("");
    //     }
    // }, [sellAmount])

    // const buying = async () => {
    //     try {
    //         const response = await axios.post(
    //             `${api_url}user/add-user-coin-held`, { walletAddress: account, contractAddress: detail?.contractAddress }, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //             },
    //         }
    //         )
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //     }
    // };

    // const deleteBuying = async () => {
    //     try {
    //         const response = await axios.delete(
    //             `${api_url}user/delete-user-coin-held`, { walletAddress: account, contractAddress: detail?.contractAddress }, {
    //             headers: {
    //                 "Authorization": `Bearer ${token}`,
    //             },
    //         }
    //         )
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //     }
    // };

    // useEffect(() => {
    //     const getProjectOHLC = async () => {
    //         try {
    //             const queryParams = { interval: TimeInterval.MINUTE, projectId: id }
    //             const { data } = await axios.get(`${api_url}analytics/get-project-ohlc`, { params: queryParams });
    //             if (data) { setInitialData(data) }
    //         }
    //         catch (e) {
    //             console.error('error: ', e)
    //         }
    //     }
    //     if (id) {
    //         getProjectOHLC()
    //     }
    // }, [id])

    // const getTwentyHolder = async () => {
    //     try {
    //         const { data } = await axios.get(`${api_url}project/get-top-twenty-holders/${chainId}/${detail?.contractAddress}?page=1&limit=20`);
    //         setTopHolder(data?.data)
    //     } catch (error) {
    //         console.error("Error fetching Top 20 Holders:", error);
    //         setLoader(false);
    //     }
    // };

    // useEffect(() => {
    //     if (detail?.contractAddress) {
    //         const timeout = setTimeout(() => {
    //             getTwentyHolder();
    //         }, 10000);
    //         return () => clearTimeout(timeout);
    //     }
    // }, [detail]);

    // const fetchEthBalance = async () => {
    //     try {
    //         const balance = await BalanceHook();
    //         setEthBalance(balance);
    //     } catch (error) {
    //         console.error("Error fetching ETH balance:", error);
    //     }

    // };

    // useEffect(() => {
    //     const fetchBalance = async () => {
    //         if (account && web3) {
    //             try {
    //                 await fetchEthBalance();
    //                 await fetchRemainingEth();
    //             } catch (error) {
    //                 console.error("Error fetching ETH balance:", error);
    //             }
    //         }
    //     };

    //     fetchBalance();
    // }, [account, web3]);

    // const getUniSwapTxData = async (buy) => {
    //     try {
    //         const txResponse = await rockRelayerTransactions(buy ? tradeAmount : sellAmount, detail?.contractAddress, buy)
    //         return txResponse
    //     }
    //     catch (error) {
    //         setIsTransactionOcurring(false)
    //         setLoader(false);
    //         if (error?.code === 4001) {
    //             toast?.error("User Rejected!")
    //         } else {
    //             toast?.error("Transaction Failed!")
    //         }
    //     }
    // }

    useEffect(() => {
        if (uniSwapPoolAddreess) {
            setTimeout(() => {
                setIframeSrc(`https://www.dextools.io/widget-chart/en/arbitrum/pe-light/${uniSwapPoolAddreess}?theme=light&chartType=1&chartResolution=1&drawingToolbars=false&t=${Date.now()}`);
                setIframeKey(prevKey => prevKey + 1);
            }, 5000);
        }
    }, [uniSwapPoolAddreess]);

    useEffect(() => {
        if (isTokenGraduate && +percentage >= 100) {
            getRocksDetail()
        }
    }, [isTokenGraduate, percentage])


    useEffect(() => {
        if (likeData) {
            setListComment((prevComments: any) =>
                Array.isArray(prevComments)
                    ? prevComments.map(comment =>
                        comment._id === likeData._id
                            ? { ...comment, likes: likeData.likes }
                            : comment
                    )
                    : []
            );
        }
    }, [likeData]);

    const formatTokenPrice = (price: number, ethPrice: number) => {
        if (price === 0) return "0.00";
        if (price >= 1) return price.toFixed(2);
        const value = price * ethPrice;
        const exponent = Math.floor(Math.log10(value));
        const absExponent = Math.abs(exponent);

        if (absExponent - 1 >= 4) {
            const significant = (value / Math.pow(10, exponent)).toFixed(10);
            const formattedNumber = significant.replace(".", "").slice(0, 4);

            return (
                <span style={{ fontSize: "14px" }}>
                    0.0<sub style={{ fontSize: "8px", verticalAlign: "middle" }}>
                        {absExponent - 1}
                    </sub>{formattedNumber}
                </span>
            );
        } else {
            return price.toFixed(absExponent + 2);
        }
    };


    return (
        <>
            {/* {loader && <Loader text={loaderMessage} />} */}
            <Navbar />
            <div className="custom-container">
                <section className='Main_chart desktop'>
                    <div className='top_chart'>
                        <div className='left_side'>
                            <div className='outer_side'>
                                <span className='span_chartt'></span>
                                <div className='chart_topside'>
                                    <div className='man_Div'>
                                        <img src={detail?.pfp ? detail?.pfp : 'asset/broken.png'} className='imageman' />
                                        <div>
                                            <h1>{detail?.projectName}</h1>
                                            <p className='kevaiii'>${detail?.ticker}</p>
                                        </div>
                                    </div>
                                    <div className='line_div'>

                                    </div>
                                    <div className='outer_text'>
                                        <p>Price</p>
                                        <h1>$
                                            {formatTokenPrice(+tokenPrice, ethPrice) || '0.00'}
                                        </h1>

                                    </div>
                                    <div className='outer_text'>
                                        <p>Market Cap (FDV)</p>
                                        <h1>
                                            {detail?.isGraduated ? (+marketCap) >= 1 ? `$${formatMarketCap(+marketCap)}` : "< $1" : (+marketCap) >= 1 ? `$${formatEthinDollar(+marketCap, ethPrice)}` : "< $1"}</h1>
                                    </div>

                                    <div className='outer_text'>
                                        <p>Created By</p>
                                        <div className='small_imgdiv'>
                                            <h1>{getFormatedWeb3Address(detail?.creatorAddress, true)}</h1>
                                        </div>
                                    </div>
                                    <div className='outer_text'>
                                        <p>Age</p>
                                        <h1>{lastTime}</h1>
                                    </div>
                                </div>
                                <div className='top_trade'>
                                    <div className='innnner_tradee'>
                                        {!!uniSwapPoolAddreess && <a href={uniSwapPoolContractAddress || ''} target='blank' className='trade_div'>
                                            <h2>Trade on</h2>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14" fill="none">
                                                <path d="M6.05632 6.54081C6.32646 7.01726 5.71864 7.15338 5.4485 7.18741C5.04329 7.22145 4.94199 6.98322 5.00953 6.67694C5.04329 6.57484 5.11083 6.47275 5.17836 6.40468C5.2459 6.33662 5.38097 6.26855 5.48227 6.26855C5.58357 6.26855 5.71864 6.26855 5.78618 6.33662C5.92125 6.37065 5.98878 6.43871 6.05632 6.54081Z" fill="#EB1A6B" />
                                                <path d="M7.67716 5.68994C7.37325 8.07217 11.4929 7.56169 11.4254 9.43345C11.8306 8.88894 11.9994 7.4596 10.8175 6.7109C9.73698 6.03026 8.35251 6.40461 7.67716 5.68994Z" fill="#EB1A6B" />
                                                <path d="M10.0753 4.77119C10.0416 4.73716 10.0078 4.73716 10.0078 4.70312C10.0078 4.73716 10.0416 4.77119 10.0753 4.77119Z" fill="#EB1A6B" />
                                                <path d="M11.0199 6.50671C10.9861 6.43865 10.9524 6.37058 10.8848 6.30252C10.7498 6.09833 10.5472 5.9622 10.3108 5.92817C10.1757 5.89414 10.0069 5.8601 9.83804 5.8601C9.6692 5.8601 9.53413 5.82607 9.3653 5.82607C9.02762 5.79204 8.72371 5.75801 8.38604 5.68995C8.3185 5.65591 8.2172 5.65591 8.14967 5.62188C8.1159 5.62188 8.08213 5.58785 8.0146 5.58785C7.98083 5.55382 7.94706 5.55382 7.87953 5.51979C7.71069 5.45172 7.57562 5.3156 7.47432 5.2135C7.23794 4.97528 7.03534 4.70302 6.83273 4.4648C6.63013 4.19254 6.46129 3.95432 6.22492 3.7161C6.02231 3.47788 5.75217 3.27368 5.48203 3.13756C5.2119 3.00143 4.87422 2.89933 4.57031 2.8653C4.90799 2.83127 5.24566 2.8653 5.54957 3.00143C5.85348 3.13756 6.15738 3.30772 6.39376 3.54594C6.56259 3.68207 6.69766 3.85223 6.83273 4.02239C7.87953 3.81819 8.68995 3.98835 9.33153 4.3627C9.53413 4.4648 9.73674 4.60093 9.90558 4.77109C9.93934 4.80512 9.97311 4.80512 9.97311 4.83915C10.1082 4.97528 10.2433 5.1114 10.3446 5.24753C10.8173 5.68995 11.0199 6.20042 11.0199 6.50671Z" fill="#EB1A6B" />
                                                <path d="M4.67244 3.1377C4.94258 3.17173 5.21272 3.27382 5.38156 3.47801C5.55039 3.6822 5.61793 3.95446 5.68546 4.19268C5.71923 4.39687 5.753 4.60106 5.82053 4.77122C5.8543 4.87332 5.92184 4.94138 5.9556 5.00945C5.98937 5.07751 6.05691 5.14558 6.09067 5.21364V5.24767V5.2817C5.98937 5.3838 5.753 5.2817 5.6517 5.21364C5.48286 5.14558 5.34779 5.00945 5.21272 4.87332C4.84128 4.46494 4.63867 3.85236 4.63867 3.30785C4.63867 3.27382 4.67244 3.20576 4.67244 3.1377Z" fill="#EB1A6B" />
                                                <path d="M9.0613 7.90234C8.48725 9.50184 11.0873 10.5909 10.1081 12.2244C11.0873 11.816 11.5601 10.5568 11.1549 9.5699C10.8172 8.68508 9.73665 8.34476 9.0613 7.90234Z" fill="#EB1A6B" />
                                                <path d="M5.65137 9.97764C5.8202 9.87554 5.98904 9.77345 6.15788 9.67135C6.32672 9.60329 6.52932 9.53522 6.73193 9.50119C7.10337 9.43313 7.50858 9.3991 7.81249 9.26297C7.98132 9.19491 8.11639 9.12684 8.25146 8.99071C8.38653 8.88862 8.45407 8.75249 8.5216 8.58233C8.58914 8.41217 8.58914 8.24201 8.58914 8.07185C8.58914 7.86766 8.5216 7.6975 8.45407 7.52734C8.58914 7.66347 8.69044 7.86766 8.75798 8.07185C8.82551 8.27604 8.82551 8.48023 8.79174 8.68443C8.75798 8.88862 8.62291 9.09281 8.48784 9.26297C8.35277 9.3991 8.15016 9.53522 7.94756 9.60329C7.74495 9.67135 7.54235 9.70538 7.33974 9.73941C7.13714 9.73941 6.9683 9.77345 6.76569 9.77345C6.39425 9.77345 6.02281 9.84151 5.65137 9.97764Z" fill="#EB1A6B" />
                                                <path d="M9.29857 12.8027C9.23103 12.8367 9.19726 12.9048 9.12973 12.9388C9.06219 12.9728 8.99466 13.0069 8.92712 13.0409C8.79205 13.109 8.62322 13.143 8.45438 13.143C8.0154 13.143 7.71149 12.8027 7.54266 12.4283C7.40759 12.1901 7.34005 11.9179 7.20498 11.6796C7.00238 11.3393 6.63093 11.0671 6.22572 11.1011C6.05689 11.1351 5.88805 11.2032 5.82051 11.3393C5.58414 11.7137 5.92182 12.2582 6.39456 12.1901C6.42833 12.1901 6.4621 12.1901 6.49586 12.1561C6.52963 12.1561 6.5634 12.122 6.59717 12.088C6.6647 12.0199 6.69847 11.9519 6.73224 11.8838C6.766 11.8158 6.766 11.7137 6.766 11.6116C6.73224 11.5095 6.69847 11.4414 6.63093 11.4074C6.73224 11.4414 6.79977 11.5095 6.83354 11.6116C6.79977 11.7817 6.79977 11.8838 6.79977 11.9859C6.766 12.088 6.73224 12.1901 6.6647 12.2582C6.63093 12.2922 6.59717 12.3262 6.52963 12.3603C6.49586 12.3943 6.42833 12.4283 6.39456 12.4283C6.29326 12.4624 6.19196 12.4624 6.09065 12.4624C5.95558 12.4283 5.78675 12.3943 5.68544 12.2922C5.55037 12.1901 5.44907 12.0199 5.314 11.9179C5.17893 11.7477 5.01009 11.6456 4.80749 11.5435C4.67242 11.4754 4.53735 11.4414 4.40228 11.4074C4.33474 11.4074 4.26721 11.3733 4.19967 11.3733C4.16591 11.3733 3.99707 11.3393 3.99707 11.3393C4.23344 11.1351 4.46981 10.965 4.70619 10.7948C4.97633 10.6246 5.24647 10.5225 5.55037 10.4204C5.85428 10.3184 6.15819 10.3184 6.49586 10.3524C6.6647 10.3864 6.79977 10.4204 6.96861 10.4885C7.13745 10.5566 7.27252 10.6587 7.40759 10.7608C7.54266 10.8969 7.64396 11.033 7.71149 11.1692C7.77903 11.3053 7.8128 11.4754 7.84656 11.6456C7.94787 12.122 7.9141 12.8707 8.52191 12.9728C8.55568 12.9728 8.58945 12.9728 8.62322 12.9728H8.72452C8.79205 12.9728 8.85959 12.9728 8.92712 12.9388C9.02843 12.9388 9.1635 12.8707 9.29857 12.8027Z" fill="#EB1A6B" />
                                                <path d="M5.14461 5.55366C5.11084 5.65575 5.07708 5.72381 5.04331 5.79188C4.94201 5.92801 4.80694 6.0301 4.67187 6.09817C4.5368 6.16623 4.40173 6.20026 4.23289 6.20026C4.19912 6.20026 4.16535 6.20026 4.13159 6.20026C4.03028 6.20026 3.96275 6.23429 3.86145 6.30236C3.79391 6.37042 3.72638 6.43848 3.72638 6.54058C3.72638 6.57461 3.69261 6.64268 3.69261 6.67671C3.69261 6.81284 3.65884 6.91493 3.65884 7.08509C3.62508 7.35735 3.55754 7.59557 3.45624 7.83379C3.32117 8.14008 3.15233 8.41233 3.1861 8.75265C3.21986 8.99087 3.32117 9.16103 3.49001 9.29716C3.76015 9.60345 4.40173 9.73958 4.26666 10.4542C4.16535 10.8967 3.45624 11.3391 2.47698 11.5092C2.57828 11.5092 2.34191 11.1008 2.34191 11.0668C2.24061 10.8967 2.10554 10.7265 2.038 10.5563C1.86917 10.216 1.80163 9.77361 1.86917 9.39925C1.9367 8.99087 2.24061 8.68459 2.47698 8.34427C2.78089 7.96992 3.0848 7.49347 3.15233 6.98299C3.15233 6.8809 3.1861 6.71074 3.21987 6.57461C3.25363 6.40445 3.2874 6.26833 3.35493 6.09817C3.3887 5.99607 3.45624 5.92801 3.55754 5.82591C3.59131 5.79188 3.62508 5.72382 3.62508 5.68978C3.62508 5.62172 3.62508 5.58769 3.59131 5.51962L2.00424 2.62692L4.30042 5.48559C4.33419 5.51962 4.36796 5.55366 4.40173 5.55366C4.43549 5.58769 4.46926 5.58769 4.5368 5.58769C4.57056 5.58769 4.60433 5.58769 4.67187 5.55366C4.70563 5.51962 4.7394 5.51962 4.77317 5.48559C4.80694 5.45156 4.80694 5.41753 4.80694 5.34946C4.80694 5.31543 4.80694 5.24737 4.77317 5.21334C4.6381 5.00915 4.46926 4.83899 4.30042 4.6348L3.72638 3.92013L2.57828 2.49079L0.991211 0.48291L2.71335 2.35466L3.92898 3.71594L4.5368 4.39657C4.7394 4.6348 4.94201 4.83899 5.14461 5.11124L5.17838 5.14527V5.21334C5.17838 5.34947 5.17838 5.45156 5.14461 5.55366Z" fill="#EB1A6B" />
                                                <path d="M5.68477 12.2579C5.58346 12.1559 5.48216 12.0538 5.38086 11.9517C5.48216 12.0878 5.5497 12.1899 5.68477 12.2579Z" fill="#EB1A6B" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M35.434 4.56653C34.3197 4.83878 33.8132 5.72361 34.1171 6.7786C34.2521 7.22101 34.6573 7.69746 35.2652 8.03778C36.312 8.65035 36.6496 8.88857 36.8185 9.26292C36.9535 9.56921 36.9873 9.67131 36.9198 9.97759C36.7509 10.6582 36.2782 10.9985 35.6028 10.9985C34.9275 10.9985 34.4547 10.6242 34.3197 9.97759C34.2859 9.70534 34.2184 9.63727 34.1171 9.63727C33.982 9.63727 33.9482 9.70534 33.9482 10.3519V11.0666L34.3872 11.2027C35.0963 11.441 36.0756 11.4069 36.6496 11.1347C37.7977 10.5902 38.2367 9.53518 37.7302 8.54825C37.5276 8.1739 37.0548 7.76552 36.2444 7.25504C35.3665 6.71054 34.995 6.33618 34.9275 5.96183C34.8262 5.34926 35.3665 4.87282 36.1094 4.87282C36.6834 4.87282 36.9198 5.00894 37.1224 5.45136C37.2574 5.72361 37.325 5.82571 37.4938 5.82571C37.6627 5.82571 37.6964 5.79167 37.6289 5.62151C37.5951 5.51942 37.5614 5.24717 37.5614 5.04297C37.5614 4.77072 37.5276 4.63459 37.4263 4.60056C37.1899 4.49846 35.7379 4.46443 35.434 4.56653ZM13.1475 4.80475C13.1475 4.94088 13.215 4.97491 13.3501 4.97491C13.7553 4.97491 13.789 5.07701 13.8228 7.56133C13.8566 9.70534 13.8903 9.8755 14.0592 10.2158C14.2956 10.6582 14.6332 10.9645 15.1397 11.2027C15.4774 11.3729 15.7138 11.4069 16.4229 11.4069C17.1658 11.4069 17.3346 11.3729 17.7398 11.1687C18.01 11.0326 18.3477 10.7944 18.4827 10.6242C18.9555 10.0457 19.023 9.73937 19.0568 7.35714C19.1243 5.04297 19.1243 5.00894 19.4957 5.00894C19.5971 5.00894 19.6308 4.94088 19.6308 4.83878C19.6308 4.66862 19.5633 4.66862 18.6178 4.66862C17.6723 4.66862 17.6048 4.66862 17.6048 4.83878C17.6048 4.97491 17.6723 5.00894 17.8749 5.04297C18.3139 5.07701 18.3477 5.24717 18.3477 7.35714C18.3477 9.50115 18.2801 9.90953 17.8074 10.3519C17.4022 10.7603 17.0645 10.8965 16.4904 10.8965C15.68 10.8965 15.0722 10.5221 14.9034 9.84146C14.8358 9.60324 14.8021 8.78648 14.8358 7.32311L14.8696 5.14507L15.1735 5.04297C15.3423 4.97491 15.4774 4.87281 15.5112 4.80475C15.545 4.66862 15.4099 4.66862 14.3631 4.66862C13.215 4.63459 13.1475 4.63459 13.1475 4.80475ZM21.0153 4.80475C21.0153 4.94088 21.0828 4.97491 21.2517 4.97491C21.6906 4.97491 21.927 5.14507 22.0283 5.51942C22.0958 5.72361 22.0958 6.71054 22.0958 8.10584C22.0621 10.6242 22.0283 10.7944 21.5218 10.8965C21.353 10.9305 21.2854 10.9985 21.2854 11.1006C21.2854 11.2368 21.353 11.2708 22.4673 11.2708C23.5478 11.2708 23.6491 11.2708 23.6491 11.1347C23.6491 11.0326 23.5478 10.9645 23.2777 10.8965C22.94 10.7944 22.9063 10.7603 22.805 10.4881C22.6699 10.0797 22.6699 6.23409 22.7712 6.26812C22.805 6.26812 23.1426 6.60844 23.5141 7.05085C23.8855 7.49327 24.8648 8.61632 25.7427 9.53518C27.0934 10.9985 27.3298 11.2708 27.5324 11.2708H27.7688L27.8025 8.276C27.8363 6.13199 27.8701 5.24716 27.9376 5.1791C28.0052 5.11104 28.174 5.04297 28.3091 5.00894C28.4779 4.97491 28.5792 4.90685 28.5792 4.83878C28.5792 4.73669 28.3766 4.70266 27.4311 4.70266C26.3168 4.66862 26.283 4.66862 26.283 4.83878C26.283 4.97491 26.3505 5.00894 26.4856 5.00894C26.5869 5.00894 26.7895 5.11104 26.9246 5.21313L27.161 5.41732L27.1947 7.45924C27.1947 8.61632 27.1947 9.50115 27.161 9.50115C27.1272 9.50115 26.8571 9.22889 26.5869 8.92261C26.3168 8.61632 25.5401 7.73149 24.8648 6.98279C24.1894 6.23409 23.4465 5.41732 23.2102 5.14507L22.805 4.66862H21.927C21.0491 4.63459 21.0153 4.63459 21.0153 4.80475ZM29.8624 4.80475C29.8624 4.94088 29.9299 4.97491 30.0987 4.97491C30.2338 4.97491 30.4026 5.04297 30.5039 5.11104C30.6728 5.21313 30.6728 5.38329 30.7066 7.73149C30.7403 10.6582 30.7066 10.8284 30.2 10.8965C29.9637 10.9305 29.8624 10.9985 29.8624 11.1006C29.8624 11.2368 29.9637 11.2708 31.1455 11.2708C32.3612 11.2708 32.4287 11.2708 32.4287 11.1006C32.4287 10.9645 32.3612 10.9305 32.2261 10.9305C32.1248 10.9305 31.9559 10.8624 31.8546 10.7944C31.6858 10.6923 31.6858 10.5221 31.652 8.00374C31.6183 5.41732 31.6183 5.31523 31.7871 5.14507C31.8884 5.04297 32.0573 4.97491 32.1586 4.97491C32.3274 4.97491 32.3612 4.94088 32.3612 4.80475C32.3612 4.63459 32.2936 4.63459 31.078 4.63459C29.9299 4.63459 29.8624 4.63459 29.8624 4.80475ZM38.7432 4.80475C38.777 4.90685 38.8445 4.97491 38.9796 4.97491C39.0809 4.97491 39.2497 5.07701 39.351 5.1791C39.4523 5.2812 40.0264 6.6765 40.668 8.34406L41.7823 11.3048L42.0862 11.3389L42.3901 11.3729L43.1668 9.26292C43.6057 8.10584 44.0109 7.05085 44.0447 6.94876C44.146 6.74457 44.146 6.7786 44.4161 7.45924C44.5512 7.86762 44.9564 8.88857 45.2941 9.7734L45.9019 11.3729H46.1721C46.3071 11.3729 46.4422 11.3389 46.476 11.2708C46.5097 11.2027 46.8812 10.2158 47.3539 9.05873C47.7929 7.90165 48.2994 6.60844 48.4682 6.20006C48.8397 5.24716 48.9072 5.14507 49.1774 5.04297C49.3124 5.00894 49.4137 4.90685 49.4137 4.83878C49.4137 4.73669 49.2449 4.70266 48.4007 4.70266C47.4552 4.70266 47.3877 4.70266 47.3877 4.87282C47.3877 5.00894 47.4552 5.04297 47.5903 5.04297C47.928 5.04297 48.063 5.14507 48.063 5.34926C48.063 5.51942 46.4422 9.90953 46.3409 10.0116C46.2734 10.0797 44.8214 5.99587 44.7876 5.58748C44.7201 5.21313 44.8889 5.04297 45.2603 5.04297C45.3954 5.04297 45.4629 5.00894 45.4629 4.87282C45.4629 4.70266 45.3954 4.70266 44.146 4.70266C42.8966 4.70266 42.8291 4.70266 42.8291 4.87282C42.8291 4.97491 42.8966 5.04297 42.9642 5.04297C43.2343 5.04297 43.572 5.31523 43.6733 5.55345C43.8083 5.9278 43.707 6.30215 42.9304 8.34406L42.2888 10.0797L42.1537 9.73937C42.0862 9.56921 41.681 8.48019 41.2758 7.35714C40.4654 5.14507 40.4654 5.04297 41.0056 5.04297C41.2082 5.04297 41.242 5.00894 41.242 4.87282C41.242 4.70266 41.1745 4.70266 39.9926 4.70266C38.7094 4.63459 38.6757 4.63459 38.7432 4.80475ZM55.8296 4.87282C55.8296 4.87282 55.8296 4.97491 55.8296 5.00894C55.8296 5.04297 55.9309 5.04297 55.9309 5.04297C55.9984 5.04297 56.0322 5.07701 56.0997 5.07701C56.3698 5.14507 56.5387 5.1791 56.6062 5.34926C56.64 5.45136 56.6737 5.85974 56.6737 8.00374C56.6737 10.2498 56.6737 10.5221 56.6062 10.6582C56.5387 10.8284 56.4036 10.9305 56.0659 11.0326C56.0659 11.0326 55.9309 11.0666 55.8971 11.1006C55.8633 11.1347 55.8633 11.2027 55.8633 11.2027C55.8633 11.2027 55.8633 11.2708 55.8971 11.3048C55.9309 11.3389 56.0322 11.3389 56.0322 11.3389H56.8764H58.2946C58.2946 11.3389 58.3621 11.3389 58.3959 11.3048C58.4297 11.2708 58.4297 11.2027 58.4297 11.2027C58.4297 11.2027 58.4297 11.1347 58.3959 11.1006C58.3621 11.0666 58.2271 11.0326 58.2271 11.0326C57.9231 10.9645 57.7543 10.8624 57.6868 10.6923C57.6192 10.5561 57.6192 10.2498 57.6192 9.53518V8.51422C57.653 8.54825 57.6868 8.54826 57.7205 8.58229C57.8894 8.68438 58.092 8.85454 58.8349 8.85454C59.7466 8.88857 60.2869 8.48019 60.6245 8.00374C60.9622 7.5273 61.0635 6.7786 60.8271 5.96183C60.5908 5.1791 59.8817 4.66862 58.9024 4.63459C58.3959 4.60056 57.6192 4.63459 57.214 4.66862H57.1127C56.7413 4.66862 56.2685 4.73669 56.0322 4.73669C55.9646 4.73669 55.9646 4.73669 55.9309 4.77072C55.8296 4.83878 55.8296 4.87282 55.8296 4.87282ZM59.5778 8.00374C59.9492 7.66343 59.9492 7.11892 59.9492 6.74457C59.9154 6.20006 59.6791 5.14507 58.4634 5.14507C58.1595 5.14507 57.5855 5.1791 57.5517 5.58748C57.5179 5.65555 57.5179 6.16603 57.5179 6.91473V8.13987L57.653 8.20794C57.7205 8.24197 57.8218 8.276 57.9569 8.31003C58.4634 8.44616 59.2063 8.34406 59.5778 8.00374ZM51.8112 4.73669C51.9125 4.70266 51.9801 4.66862 51.9801 4.66862C51.9801 4.66862 52.1151 4.60056 52.1489 4.66862C52.1489 4.70266 52.2164 4.80475 52.3515 5.14507C52.3853 5.21313 52.419 5.2812 52.419 5.34926C52.5879 5.82571 52.858 6.50634 52.9931 6.88069C53.1282 7.25504 53.3983 7.93568 53.6009 8.48019C53.8035 8.99067 54.0399 9.63727 54.175 9.94356C54.2763 10.2498 54.4451 10.5221 54.4789 10.5902C54.5126 10.6242 54.5126 10.6582 54.5464 10.6923C54.6477 10.8284 54.749 11.0326 54.9854 11.0666C54.9854 11.0666 55.1542 11.1006 55.188 11.1347C55.2217 11.1687 55.2217 11.2027 55.2217 11.2027V11.3048C55.2217 11.3048 55.2217 11.3389 55.188 11.3389C55.188 11.3729 55.1204 11.3389 55.1204 11.3389H53.7022H52.6892C52.6892 11.3389 52.6554 11.3389 52.6217 11.3389C52.5879 11.3389 52.5879 11.2708 52.5879 11.2708V11.2027C52.5879 11.2027 52.5879 11.1347 52.6217 11.1006C52.6554 11.0666 52.8243 11.0326 52.8243 11.0326C53.1282 10.9985 53.2632 10.7603 53.297 10.6242V10.5902C53.3645 10.454 53.3308 10.3519 53.0269 9.63727C52.8243 9.16083 52.7567 9.0247 52.723 8.99067C52.6892 8.99067 52.1489 8.99067 51.5749 8.99067H50.4605L50.393 9.16083C50.1904 9.70534 50.0216 10.2158 50.0216 10.3519C49.954 10.6242 50.0553 10.9645 50.4605 11.0326C50.4605 11.0326 50.6294 11.0666 50.6631 11.1006C50.6969 11.1347 50.7307 11.2027 50.7307 11.2027V11.2708C50.7307 11.2708 50.7307 11.3048 50.6969 11.3389C50.6631 11.3729 50.5956 11.3389 50.5956 11.3389H49.5488H48.5358C48.5358 11.3389 48.502 11.3389 48.4682 11.3048C48.4345 11.2708 48.4345 11.2368 48.4345 11.2368V11.1687C48.4345 11.1687 48.4345 11.1347 48.502 11.0666C48.5696 10.9985 48.7046 10.9985 48.7046 10.9985C48.9748 10.9645 49.1436 10.6582 49.2449 10.4881C49.2449 10.4881 49.2449 10.454 49.2787 10.454C49.3124 10.386 49.4813 10.0116 49.6501 9.60324C49.8189 9.19486 49.9878 8.71841 50.0553 8.58229C50.2579 8.07181 50.4605 7.59536 50.7644 6.84666C50.9333 6.43828 51.1697 5.82571 51.3047 5.48539L51.5411 4.87282L51.8112 4.73669ZM51.7437 6.20006C51.8112 6.33618 51.8788 6.54037 51.9125 6.64247C51.9463 6.74457 52.0814 7.05085 52.1827 7.32311C52.284 7.59536 52.419 7.90165 52.4866 8.03778C52.5541 8.1739 52.5879 8.276 52.5879 8.276C52.5879 8.276 52.1827 8.276 51.6762 8.276C51.1021 8.276 50.7644 8.276 50.7644 8.24197C50.7644 8.24197 50.7982 8.1739 50.7982 8.10584C50.832 8.00375 51.0346 7.45923 51.4398 6.30215C51.5073 6.13199 51.5749 5.96183 51.5749 5.9278C51.6086 5.9278 51.6424 5.96183 51.7437 6.20006Z" fill="#02171D" />
                                            </svg>
                                            <svg className='sharebutton' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M12.25 7.58333V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H6.41667" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12.25 1.75L7 7" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.75 1.75H12.25V5.25" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </a>}
                                    </div>
                                    <div className='button_share_section'>
                                        <div className='outer_text'>
                                            <p>CA:</p>
                                            <div>
                                                <h1>
                                                    {detail?.contractAddress.slice(0, 8)}...{detail?.contractAddress.slice(-4)}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="15"
                                                        height="14"
                                                        viewBox="0 0 15 14"
                                                        fill="none"
                                                        onClick={handleCopy}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <g clipPath="url(#clip0_31_1059)">
                                                            <path
                                                                d="M12.2671 4.66675H6.43376C5.78942 4.66675 5.26709 5.18908 5.26709 5.83341V11.6667C5.26709 12.3111 5.78942 12.8334 6.43376 12.8334H12.2671C12.9114 12.8334 13.4338 12.3111 13.4338 11.6667V5.83341C13.4338 5.18908 12.9114 4.66675 12.2671 4.66675Z"
                                                                stroke="#E59572"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                            <path
                                                                d="M2.93376 9.33342C2.29209 9.33342 1.76709 8.80842 1.76709 8.16675V2.33341C1.76709 1.69175 2.29209 1.16675 2.93376 1.16675H8.76709C9.40876 1.16675 9.93376 1.69175 9.93376 2.33341"
                                                                stroke="#E59572"
                                                                strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_31_1059">
                                                                <rect
                                                                    width="14"
                                                                    height="14"
                                                                    fill="white"
                                                                    transform="translate(0.600098)"
                                                                />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </h1>
                                                {copied && <p style={{ color: "#E59572", marginTop: "5px" }}>Copied!</p>}
                                            </div>
                                        </div>
                                        <button onClick={() => handleShare(window?.location?.href)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                            <path d="M16.148 7.71048L12.773 11.0855C12.6674 11.191 12.5243 11.2503 12.375 11.2503C12.2257 11.2503 12.0826 11.191 11.977 11.0855C11.8715 10.9799 11.8122 10.8368 11.8122 10.6875C11.8122 10.5382 11.8715 10.3951 11.977 10.2895L14.3923 7.87501H11.6016C10.2295 7.87463 8.89628 8.33029 7.81147 9.17033C6.72667 10.0104 5.95184 11.1872 5.60883 12.5156C5.57153 12.6602 5.47835 12.7839 5.34979 12.8598C5.22122 12.9356 5.0678 12.9572 4.92328 12.9199C4.77876 12.8826 4.65497 12.7895 4.57915 12.6609C4.50333 12.5323 4.48169 12.3789 4.51898 12.2344C4.92371 10.664 5.83928 9.27279 7.12152 8.27989C8.40377 7.28699 9.97984 6.74878 11.6016 6.75001H14.3937L11.977 4.33548C11.9248 4.28321 11.8833 4.22117 11.855 4.15289C11.8267 4.0846 11.8122 4.01142 11.8122 3.93751C11.8122 3.8636 11.8267 3.79041 11.855 3.72213C11.8833 3.65384 11.9248 3.5918 11.977 3.53954C12.0826 3.43399 12.2257 3.37469 12.375 3.37469C12.4489 3.37469 12.5221 3.38925 12.5904 3.41754C12.6587 3.44582 12.7207 3.48728 12.773 3.53954L16.148 6.91454C16.2003 6.96678 16.2418 7.02882 16.2701 7.0971C16.2984 7.16539 16.3129 7.23859 16.3129 7.31251C16.3129 7.38643 16.2984 7.45963 16.2701 7.52791C16.2418 7.5962 16.2003 7.65824 16.148 7.71048ZM13.5 14.625H2.8125V6.18751C2.8125 6.03832 2.75324 5.89525 2.64775 5.78976C2.54226 5.68427 2.39918 5.62501 2.25 5.62501C2.10082 5.62501 1.95774 5.68427 1.85225 5.78976C1.74676 5.89525 1.6875 6.03832 1.6875 6.18751V15.1875C1.6875 15.3367 1.74676 15.4798 1.85225 15.5853C1.95774 15.6907 2.10082 15.75 2.25 15.75H13.5C13.6492 15.75 13.7923 15.6907 13.8977 15.5853C14.0032 15.4798 14.0625 15.3367 14.0625 15.1875C14.0625 15.0383 14.0032 14.8953 13.8977 14.7898C13.7923 14.6843 13.6492 14.625 13.5 14.625Z" fill="#311E1A" />
                                        </svg>Share</button>
                                    </div>

                                </div>
                                <div id="chart">
                                    {!!uniSwapPoolAddreess || detail?.isGraduated ?
                                        <iframe
                                            key={iframeKey}
                                            id="dextools-widget"
                                            width="100%"
                                            height="400"
                                            src={iframeSrc}>
                                        </iframe>
                                        :
                                        <>
                                            TradingViewChart
                                            {/* <TradingViewChart initialData={initialData} liveData={liveData} /> */}
                                        </>
                                    }
                                </div>
                            </div>
                            {detail?.projectDescription || checkLinks ?
                                <div className='midddle_left'>
                                    {checkLinks ?
                                        <> <h1>
                                            Social Links
                                        </h1>

                                            <div className='imgdiv'>
                                                {detail?.twitter &&
                                                    <a href={detail?.twitter} target="_blank" rel="noopener noreferrer">
                                                        <img className="websiteslogo" src='\asset\xnew.svg' /></a>}
                                                {detail?.telegram &&
                                                    <a href={detail?.telegram} target="_blank" rel="noopener noreferrer">
                                                        <img className="websiteslogo" src='\asset\telenew.svg' /></a>}
                                                {detail?.discord &&
                                                    <a href={detail?.discord} target="_blank" rel="noopener noreferrer">
                                                        <img className="websiteslogo" src='\asset\twe.svg' /></a>}
                                                {detail?.youtube &&
                                                    <a href={detail?.youtube} target="_blank" rel="noopener noreferrer">
                                                        <img className="websiteslogo" src='\asset\youtube.svg' /></a>}
                                                {detail?.website &&
                                                    <a href={detail?.website} target="_blank" rel="noopener noreferrer">
                                                        <img className="websiteslogo" src='\asset\stroke.svg' /></a>}
                                            </div></> : ""}
                                    <h2>Description</h2>
                                    <p>{detail?.projectDescription}</p>
                                </div> : ''}
                            <div className='tabs_form'>
                                <div className="d-flex align-items-start forrm_tabb">
                                    <div className='tabbbs_data '>
                                        <div className="nav  nav-pills tabbss_div" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            <button className="nav-link active" id="v-pills-homenew-tab" data-bs-toggle="pill" data-bs-target="#v-pills-homenew" type="button" role="tab" aria-controls="v-pills-homenew" aria-selected="true">Forum Chat</button>
                                            <button className="nav-link" id="v-pills-profilenew-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profilenew" type="button" role="tab" aria-controls="v-pills-profilenew" aria-selected="false">Transaction</button>
                                        </div>
                                    </div>
                                    <div className='tabs__lower'>
                                        <div className="tab-content" id="v-pills-tabContent">
                                            <div className="tab-pane fade show active mydatttta" id="v-pills-homenew" role="tabpanel" aria-labelledby="v-pills-homenew-tab">
                                                <div className='bottom_left'>
                                                    <h1>Forum Chat</h1>
                                                    <textarea id="w3review" maxLength={300} name="w3review" rows={4} cols={50} placeholder='Type your comment' value={postComment} onChange={(e) => setPostComment(e.target.value)} />
                                                    <div className='textarea_div'>
                                                        <p>{postComment?.length}/300 Characters</p>
                                                        <button disabled={commentDisable}> {commentDisable ? <Spinner size="sm" /> :
                                                            "Post"}</button>
                                                    </div>
                                                    {/* {
                                                        listComment && listComment?.length > 0 ? (
                                                            listComment?.map((item, index) => {
                                                                // const userLike = item?.likes?.find(like => like.userId === userId);
                                                                // const isLiked = userLike ? userLike.isLiked : false;
                                                                // const likeCount = item?.likes?.filter(like => like.isLiked).length;
                                                                return ( */}
                                                    <>
                                                        <div>
                                                            <div className='top_sidebarr new_area'>
                                                                <div className='bottom_area '>
                                                                    <div className='smallimg_div'>
                                                                        {/* <img src={item?.userId?.pfp} /> */}
                                                                        {/* <h3>{item?.walletAddress?.slice(0, 5)}...{item?.walletAddress?.slice(-3)}</h3> */}
                                                                    </div>
                                                                    <p>
                                                                        {/* {moment(item.createdAt).format('DD/MM/YYYY h:mm A')} */}
                                                                    </p>
                                                                    {/* {likeCount > 0 && <p>{likeCount}</p>} */}
                                                                    {/* <LikeButton itemId={item?._id} isLiked={isLiked} setLikeData={setLikeData} /> */}
                                                                    LikeButton
                                                                </div>
                                                                {/* {item?.walletAddress?.toLowerCase() === account?.toLowerCase() && ( */}
                                                                <div className='del_edit'>
                                                                    <img
                                                                        // onClick={() => handleShow112(item?.comment, item?.walletAddress, item?._id)}
                                                                        src='/asset/edittt.svg'
                                                                        alt="Edit"
                                                                    />
                                                                    <img
                                                                        // onClick={() => handleShow12(item?._id)}
                                                                        src='/asset/dell.svg'
                                                                        alt="Delete"
                                                                    />
                                                                </div>
                                                                {/* )} */}
                                                            </div>

                                                            <h5> item
                                                                {/* {item?.comment} */}
                                                            </h5></div>
                                                    </>
                                                    {/* )
                                                            })
                                                        )
                                                            :
                                                            <p>No Comments Found!</p>
                                                    } */}
                                                </div>
                                            </div>
                                            {detail &&
                                                <div className="tab-pane fade" id="v-pills-profilenew" role="tabpanel" aria-labelledby="v-pills-profilenew-tab">
                                                    Transactiontable
                                                    {/* <Transactiontable ticker={detail?.ticker} contractAddress={detail?.contractAddress} /> */}
                                                </div>
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div>



                        </div>
                        <div className='right_side'>
                            <div className='tabs_div'>
                                <div className="d-flex align-items-start sellbuy_tab">
                                    <div className='tabbbs_data '>
                                        <div className="nav  nav-pills me-3 tabbss_div" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                            <button className="nav-link active" id="v-pills-home-tab" data-bs-toggle="pill" data-bs-target="#v-pills-home" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Buy</button>
                                            <button className="nav-link" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Sell</button>
                                        </div>
                                    </div>
                                    <div className='tabs__lower'>
                                        <div className="tab-content" id="v-pills-tabContent">
                                            <div className="tab-pane fade show active mydatttta" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                <div className='tab_buy'>
                                                    <div className='balance_div'>
                                                        <p>Balance</p>
                                                        {/* <h1>{(+ethBalance)?.toFixed(6)} ETH</h1> */}
                                                    </div>
                                                    <div className='gemsdiv'>
                                                        <div>
                                                            <h2>Amount</h2>
                                                            <input type="number" min={0} placeholder='0.00' id="fname" name="fname" className='inputamount' value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} />
                                                        </div>
                                                        <h4><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                            <g clip-path="url(#clip0_1158_273)">
                                                                <path d="M1.62732 5.47242V12.5284C1.62732 12.982 1.86492 13.3924 2.26092 13.6228L8.37372 17.1508C8.76252 17.374 9.24492 17.374 9.63372 17.1508L15.7465 13.6228C16.1353 13.3996 16.3801 12.982 16.3801 12.5284V5.47242C16.3801 5.01882 16.1425 4.60842 15.7465 4.37802L9.63372 0.850017C9.24492 0.626817 8.76252 0.626817 8.37372 0.850017L2.26092 4.37802C1.87212 4.60122 1.63452 5.01882 1.63452 5.47242H1.62732Z" fill="#213147" />
                                                                <path d="M10.3321 10.3677L9.4609 12.7581C9.4393 12.8229 9.4393 12.8949 9.4609 12.9669L10.9585 17.0781L12.6937 16.0773L10.6129 10.3677C10.5625 10.2381 10.3825 10.2381 10.3321 10.3677Z" fill="#12AAFF" />
                                                                <path d="M12.0817 6.35013C12.0313 6.22053 11.8513 6.22053 11.8009 6.35013L10.9297 8.74053C10.9081 8.80533 10.9081 8.87733 10.9297 8.94933L13.3849 15.6813L15.1201 14.6805L12.0817 6.35733V6.35013Z" fill="#12AAFF" />
                                                                <path d="M9.00006 1.116C9.04326 1.116 9.08646 1.1304 9.12246 1.152L15.7321 4.968C15.8113 5.0112 15.8545 5.0976 15.8545 5.184V12.816C15.8545 12.9024 15.8041 12.9888 15.7321 13.032L9.12246 16.848C9.08646 16.8696 9.04326 16.884 9.00006 16.884C8.95686 16.884 8.91366 16.8696 8.87766 16.848L2.26806 13.032C2.18886 12.9888 2.14566 12.9024 2.14566 12.816V5.1768C2.14566 5.0904 2.19606 5.004 2.26806 4.9608L8.87766 1.1448C8.91366 1.1232 8.95686 1.1088 9.00006 1.1088V1.116ZM9.00006 0C8.76246 0 8.53206 0.0576 8.31606 0.18L1.70646 3.996C1.28166 4.2408 1.02246 4.6872 1.02246 5.1768V12.8088C1.02246 13.2984 1.28166 13.7448 1.70646 13.9896L8.31606 17.8056C8.52486 17.928 8.76246 17.9856 9.00006 17.9856C9.23766 17.9856 9.46806 17.928 9.68406 17.8056L16.2937 13.9896C16.7185 13.7448 16.9777 13.2984 16.9777 12.8088V5.1768C16.9777 4.6872 16.7185 4.2408 16.2937 3.996L9.67686 0.18C9.46806 0.0576 9.23046 0 8.99286 0H9.00006Z" fill="#9DCCED" />
                                                                <path d="M4.62244 15.689L5.23444 14.0186L6.45844 15.0338L5.31364 16.085L4.62244 15.689Z" fill="#213147" />
                                                                <path d="M8.43841 4.63708H6.76081C6.63841 4.63708 6.52321 4.71628 6.48001 4.83148L2.88721 14.6811L4.62241 15.6819L8.58241 4.83148C8.61841 4.73068 8.54641 4.62988 8.44561 4.62988L8.43841 4.63708Z" fill="white" />
                                                                <path d="M11.376 4.63708H9.6984C9.576 4.63708 9.4608 4.71628 9.4176 4.83148L5.3136 16.0779L7.0488 17.0787L11.5128 4.83148C11.5488 4.73068 11.4768 4.62988 11.376 4.62988V4.63708Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_1158_273">
                                                                    <rect width="18" height="18" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                            ETH</h4>
                                                    </div>
                                                    <h5 className='youget_text'>You Get<span className='dashes'> {rockGet ? parseFloat(rockGet)?.toFixed(2) : "--"}</span></h5>

                                                    <button
                                                    // className={+tradeAmount == 0 || +ethBalance < +tradeAmount ? "disabled" : ""}
                                                    // onClick={() => {
                                                    //     handleBuyTrade()
                                                    // }}
                                                    // disabled={+tradeAmount == 0 || +ethBalance < +tradeAmount}
                                                    >
                                                        {
                                                            isTransactionOcurring ? (
                                                                <svg className='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                                                    <radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#311E1A'></stop><stop offset='.3' stop-color='#311E1A' stop-opacity='.9'></stop><stop offset='.6' stop-color='#311E1A' stop-opacity='.6'></stop><stop offset='.8' stop-color='#311E1A' stop-opacity='.3'></stop><stop offset='1' stop-color='#311E1A' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='21' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#311E1A' stroke-width='21' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                                                                </svg>
                                                            ) : ('Place Trade')
                                                        }
                                                    </button>
                                                    <div className='powerdby'>
                                                        <h2>Powered by</h2>
                                                        <a href='https://gems.vip/' target='blank'>
                                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                <path d="M3.3792 2.40004L1.20044 4.68036V6.15937L6.00151 10.8L10.8004 6.16186V5.56461H4.93851L5.34475 6.79767H8.07217L6.00108 8.80052L2.71128 5.61936L4.38171 3.87325H7.62046L8.33427 4.62022H10.531V4.39874L8.62125 2.40004H3.3792Z" fill="#329879" />
                                                            </svg> Gems</h4></a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                                <div className='tab_buy'>
                                                    <div className='balance_div'>
                                                        <p>Balance</p>
                                                        <h1>{(+rockBalance)?.toFixed(2)} {detail?.projectName}</h1>
                                                    </div>
                                                    <div className='gemsdiv'>
                                                        <div>
                                                            <h2>Amount</h2>
                                                            <input type="number" min={0} placeholder='0.00' id="fname" name="fname" className='inputamount' value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} />

                                                        </div>
                                                        <h4>{detail?.ticker}</h4>
                                                    </div>
                                                    <div className='gems_inner'>
                                                        {/* <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.25).toString())}>25%</h5>
                                                        <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.50).toString())}>50%</h5>
                                                        <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.75).toString())}>75%</h5>
                                                        <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 1.00).toString())}>100%</h5> */}

                                                    </div>
                                                    <h5 className='youget_text'>You Get<span className='dashes'>{gemGet ? (parseFloat(gemGet) * 0.99)?.toFixed(6) : "--"}</span></h5>
                                                    <button
                                                        className={+sellAmount == 0 || +rockBalance < +sellAmount ? "disabled" : ""}
                                                        onClick={() => {
                                                            handleSellTrade();
                                                        }}
                                                        disabled={+sellAmount == 0 || +rockBalance < +sellAmount}
                                                    >
                                                        {
                                                            isTransactionOcurring ? (
                                                                <svg className='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                                                    <radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#311E1A'></stop><stop offset='.3' stop-color='#311E1A' stop-opacity='.9'></stop><stop offset='.6' stop-color='#311E1A' stop-opacity='.6'></stop><stop offset='.8' stop-color='#311E1A' stop-opacity='.3'></stop><stop offset='1' stop-color='#311E1A' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='21' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#311E1A' stroke-width='21' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                                                                </svg>
                                                            ) : ('Place Trade')
                                                        }
                                                    </button>
                                                    <div className='powerdby'>
                                                        <h2>Powered by</h2>
                                                        <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                            <path d="M3.3792 2.40004L1.20044 4.68036V6.15937L6.00151 10.8L10.8004 6.16186V5.56461H4.93851L5.34475 6.79767H8.07217L6.00108 8.80052L2.71128 5.61936L4.38171 3.87325H7.62046L8.33427 4.62022H10.531V4.39874L8.62125 2.40004H3.3792Z" fill="#329879" />
                                                        </svg> Gems </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='inner_right'>
                                <h1>Mining Progress {isOnUniSwap ? <svg className='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                    <radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#311E1A'></stop><stop offset='.3' stop-color='#311E1A' stop-opacity='.9'></stop><stop offset='.6' stop-color='#311E1A' stop-opacity='.6'></stop><stop offset='.8' stop-color='#311E1A' stop-opacity='.3'></stop><stop offset='1' stop-color='#311E1A' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='21' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#311E1A' stroke-width='21' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                                </svg> : <span>{!!uniSwapPoolAddreess ? 100 : percentage}%</span>}</h1>
                                <ProgressBar now={!!uniSwapPoolAddreess ? 100 : percentage} />
                                {!!uniSwapPoolAddreess &&
                                    <a href={uniSwapPoolContractAddress || ''}
                                        target="_blank"
                                        rel="noreferrer">
                                        <div className='trade_div' style={{ display: 'flex', marginBottom: '10px' }}>
                                            <h2>Trade on</h2>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14" fill="none">
                                                <path d="M6.05632 6.54081C6.32646 7.01726 5.71864 7.15338 5.4485 7.18741C5.04329 7.22145 4.94199 6.98322 5.00953 6.67694C5.04329 6.57484 5.11083 6.47275 5.17836 6.40468C5.2459 6.33662 5.38097 6.26855 5.48227 6.26855C5.58357 6.26855 5.71864 6.26855 5.78618 6.33662C5.92125 6.37065 5.98878 6.43871 6.05632 6.54081Z" fill="#EB1A6B" />
                                                <path d="M7.67716 5.68994C7.37325 8.07217 11.4929 7.56169 11.4254 9.43345C11.8306 8.88894 11.9994 7.4596 10.8175 6.7109C9.73698 6.03026 8.35251 6.40461 7.67716 5.68994Z" fill="#EB1A6B" />
                                                <path d="M10.0753 4.77119C10.0416 4.73716 10.0078 4.73716 10.0078 4.70312C10.0078 4.73716 10.0416 4.77119 10.0753 4.77119Z" fill="#EB1A6B" />
                                                <path d="M11.0199 6.50671C10.9861 6.43865 10.9524 6.37058 10.8848 6.30252C10.7498 6.09833 10.5472 5.9622 10.3108 5.92817C10.1757 5.89414 10.0069 5.8601 9.83804 5.8601C9.6692 5.8601 9.53413 5.82607 9.3653 5.82607C9.02762 5.79204 8.72371 5.75801 8.38604 5.68995C8.3185 5.65591 8.2172 5.65591 8.14967 5.62188C8.1159 5.62188 8.08213 5.58785 8.0146 5.58785C7.98083 5.55382 7.94706 5.55382 7.87953 5.51979C7.71069 5.45172 7.57562 5.3156 7.47432 5.2135C7.23794 4.97528 7.03534 4.70302 6.83273 4.4648C6.63013 4.19254 6.46129 3.95432 6.22492 3.7161C6.02231 3.47788 5.75217 3.27368 5.48203 3.13756C5.2119 3.00143 4.87422 2.89933 4.57031 2.8653C4.90799 2.83127 5.24566 2.8653 5.54957 3.00143C5.85348 3.13756 6.15738 3.30772 6.39376 3.54594C6.56259 3.68207 6.69766 3.85223 6.83273 4.02239C7.87953 3.81819 8.68995 3.98835 9.33153 4.3627C9.53413 4.4648 9.73674 4.60093 9.90558 4.77109C9.93934 4.80512 9.97311 4.80512 9.97311 4.83915C10.1082 4.97528 10.2433 5.1114 10.3446 5.24753C10.8173 5.68995 11.0199 6.20042 11.0199 6.50671Z" fill="#EB1A6B" />
                                                <path d="M4.67244 3.1377C4.94258 3.17173 5.21272 3.27382 5.38156 3.47801C5.55039 3.6822 5.61793 3.95446 5.68546 4.19268C5.71923 4.39687 5.753 4.60106 5.82053 4.77122C5.8543 4.87332 5.92184 4.94138 5.9556 5.00945C5.98937 5.07751 6.05691 5.14558 6.09067 5.21364V5.24767V5.2817C5.98937 5.3838 5.753 5.2817 5.6517 5.21364C5.48286 5.14558 5.34779 5.00945 5.21272 4.87332C4.84128 4.46494 4.63867 3.85236 4.63867 3.30785C4.63867 3.27382 4.67244 3.20576 4.67244 3.1377Z" fill="#EB1A6B" />
                                                <path d="M9.0613 7.90234C8.48725 9.50184 11.0873 10.5909 10.1081 12.2244C11.0873 11.816 11.5601 10.5568 11.1549 9.5699C10.8172 8.68508 9.73665 8.34476 9.0613 7.90234Z" fill="#EB1A6B" />
                                                <path d="M5.65137 9.97764C5.8202 9.87554 5.98904 9.77345 6.15788 9.67135C6.32672 9.60329 6.52932 9.53522 6.73193 9.50119C7.10337 9.43313 7.50858 9.3991 7.81249 9.26297C7.98132 9.19491 8.11639 9.12684 8.25146 8.99071C8.38653 8.88862 8.45407 8.75249 8.5216 8.58233C8.58914 8.41217 8.58914 8.24201 8.58914 8.07185C8.58914 7.86766 8.5216 7.6975 8.45407 7.52734C8.58914 7.66347 8.69044 7.86766 8.75798 8.07185C8.82551 8.27604 8.82551 8.48023 8.79174 8.68443C8.75798 8.88862 8.62291 9.09281 8.48784 9.26297C8.35277 9.3991 8.15016 9.53522 7.94756 9.60329C7.74495 9.67135 7.54235 9.70538 7.33974 9.73941C7.13714 9.73941 6.9683 9.77345 6.76569 9.77345C6.39425 9.77345 6.02281 9.84151 5.65137 9.97764Z" fill="#EB1A6B" />
                                                <path d="M9.29857 12.8027C9.23103 12.8367 9.19726 12.9048 9.12973 12.9388C9.06219 12.9728 8.99466 13.0069 8.92712 13.0409C8.79205 13.109 8.62322 13.143 8.45438 13.143C8.0154 13.143 7.71149 12.8027 7.54266 12.4283C7.40759 12.1901 7.34005 11.9179 7.20498 11.6796C7.00238 11.3393 6.63093 11.0671 6.22572 11.1011C6.05689 11.1351 5.88805 11.2032 5.82051 11.3393C5.58414 11.7137 5.92182 12.2582 6.39456 12.1901C6.42833 12.1901 6.4621 12.1901 6.49586 12.1561C6.52963 12.1561 6.5634 12.122 6.59717 12.088C6.6647 12.0199 6.69847 11.9519 6.73224 11.8838C6.766 11.8158 6.766 11.7137 6.766 11.6116C6.73224 11.5095 6.69847 11.4414 6.63093 11.4074C6.73224 11.4414 6.79977 11.5095 6.83354 11.6116C6.79977 11.7817 6.79977 11.8838 6.79977 11.9859C6.766 12.088 6.73224 12.1901 6.6647 12.2582C6.63093 12.2922 6.59717 12.3262 6.52963 12.3603C6.49586 12.3943 6.42833 12.4283 6.39456 12.4283C6.29326 12.4624 6.19196 12.4624 6.09065 12.4624C5.95558 12.4283 5.78675 12.3943 5.68544 12.2922C5.55037 12.1901 5.44907 12.0199 5.314 11.9179C5.17893 11.7477 5.01009 11.6456 4.80749 11.5435C4.67242 11.4754 4.53735 11.4414 4.40228 11.4074C4.33474 11.4074 4.26721 11.3733 4.19967 11.3733C4.16591 11.3733 3.99707 11.3393 3.99707 11.3393C4.23344 11.1351 4.46981 10.965 4.70619 10.7948C4.97633 10.6246 5.24647 10.5225 5.55037 10.4204C5.85428 10.3184 6.15819 10.3184 6.49586 10.3524C6.6647 10.3864 6.79977 10.4204 6.96861 10.4885C7.13745 10.5566 7.27252 10.6587 7.40759 10.7608C7.54266 10.8969 7.64396 11.033 7.71149 11.1692C7.77903 11.3053 7.8128 11.4754 7.84656 11.6456C7.94787 12.122 7.9141 12.8707 8.52191 12.9728C8.55568 12.9728 8.58945 12.9728 8.62322 12.9728H8.72452C8.79205 12.9728 8.85959 12.9728 8.92712 12.9388C9.02843 12.9388 9.1635 12.8707 9.29857 12.8027Z" fill="#EB1A6B" />
                                                <path d="M5.14461 5.55366C5.11084 5.65575 5.07708 5.72381 5.04331 5.79188C4.94201 5.92801 4.80694 6.0301 4.67187 6.09817C4.5368 6.16623 4.40173 6.20026 4.23289 6.20026C4.19912 6.20026 4.16535 6.20026 4.13159 6.20026C4.03028 6.20026 3.96275 6.23429 3.86145 6.30236C3.79391 6.37042 3.72638 6.43848 3.72638 6.54058C3.72638 6.57461 3.69261 6.64268 3.69261 6.67671C3.69261 6.81284 3.65884 6.91493 3.65884 7.08509C3.62508 7.35735 3.55754 7.59557 3.45624 7.83379C3.32117 8.14008 3.15233 8.41233 3.1861 8.75265C3.21986 8.99087 3.32117 9.16103 3.49001 9.29716C3.76015 9.60345 4.40173 9.73958 4.26666 10.4542C4.16535 10.8967 3.45624 11.3391 2.47698 11.5092C2.57828 11.5092 2.34191 11.1008 2.34191 11.0668C2.24061 10.8967 2.10554 10.7265 2.038 10.5563C1.86917 10.216 1.80163 9.77361 1.86917 9.39925C1.9367 8.99087 2.24061 8.68459 2.47698 8.34427C2.78089 7.96992 3.0848 7.49347 3.15233 6.98299C3.15233 6.8809 3.1861 6.71074 3.21987 6.57461C3.25363 6.40445 3.2874 6.26833 3.35493 6.09817C3.3887 5.99607 3.45624 5.92801 3.55754 5.82591C3.59131 5.79188 3.62508 5.72382 3.62508 5.68978C3.62508 5.62172 3.62508 5.58769 3.59131 5.51962L2.00424 2.62692L4.30042 5.48559C4.33419 5.51962 4.36796 5.55366 4.40173 5.55366C4.43549 5.58769 4.46926 5.58769 4.5368 5.58769C4.57056 5.58769 4.60433 5.58769 4.67187 5.55366C4.70563 5.51962 4.7394 5.51962 4.77317 5.48559C4.80694 5.45156 4.80694 5.41753 4.80694 5.34946C4.80694 5.31543 4.80694 5.24737 4.77317 5.21334C4.6381 5.00915 4.46926 4.83899 4.30042 4.6348L3.72638 3.92013L2.57828 2.49079L0.991211 0.48291L2.71335 2.35466L3.92898 3.71594L4.5368 4.39657C4.7394 4.6348 4.94201 4.83899 5.14461 5.11124L5.17838 5.14527V5.21334C5.17838 5.34947 5.17838 5.45156 5.14461 5.55366Z" fill="#EB1A6B" />
                                                <path d="M5.68477 12.2579C5.58346 12.1559 5.48216 12.0538 5.38086 11.9517C5.48216 12.0878 5.5497 12.1899 5.68477 12.2579Z" fill="#EB1A6B" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M35.434 4.56653C34.3197 4.83878 33.8132 5.72361 34.1171 6.7786C34.2521 7.22101 34.6573 7.69746 35.2652 8.03778C36.312 8.65035 36.6496 8.88857 36.8185 9.26292C36.9535 9.56921 36.9873 9.67131 36.9198 9.97759C36.7509 10.6582 36.2782 10.9985 35.6028 10.9985C34.9275 10.9985 34.4547 10.6242 34.3197 9.97759C34.2859 9.70534 34.2184 9.63727 34.1171 9.63727C33.982 9.63727 33.9482 9.70534 33.9482 10.3519V11.0666L34.3872 11.2027C35.0963 11.441 36.0756 11.4069 36.6496 11.1347C37.7977 10.5902 38.2367 9.53518 37.7302 8.54825C37.5276 8.1739 37.0548 7.76552 36.2444 7.25504C35.3665 6.71054 34.995 6.33618 34.9275 5.96183C34.8262 5.34926 35.3665 4.87282 36.1094 4.87282C36.6834 4.87282 36.9198 5.00894 37.1224 5.45136C37.2574 5.72361 37.325 5.82571 37.4938 5.82571C37.6627 5.82571 37.6964 5.79167 37.6289 5.62151C37.5951 5.51942 37.5614 5.24717 37.5614 5.04297C37.5614 4.77072 37.5276 4.63459 37.4263 4.60056C37.1899 4.49846 35.7379 4.46443 35.434 4.56653ZM13.1475 4.80475C13.1475 4.94088 13.215 4.97491 13.3501 4.97491C13.7553 4.97491 13.789 5.07701 13.8228 7.56133C13.8566 9.70534 13.8903 9.8755 14.0592 10.2158C14.2956 10.6582 14.6332 10.9645 15.1397 11.2027C15.4774 11.3729 15.7138 11.4069 16.4229 11.4069C17.1658 11.4069 17.3346 11.3729 17.7398 11.1687C18.01 11.0326 18.3477 10.7944 18.4827 10.6242C18.9555 10.0457 19.023 9.73937 19.0568 7.35714C19.1243 5.04297 19.1243 5.00894 19.4957 5.00894C19.5971 5.00894 19.6308 4.94088 19.6308 4.83878C19.6308 4.66862 19.5633 4.66862 18.6178 4.66862C17.6723 4.66862 17.6048 4.66862 17.6048 4.83878C17.6048 4.97491 17.6723 5.00894 17.8749 5.04297C18.3139 5.07701 18.3477 5.24717 18.3477 7.35714C18.3477 9.50115 18.2801 9.90953 17.8074 10.3519C17.4022 10.7603 17.0645 10.8965 16.4904 10.8965C15.68 10.8965 15.0722 10.5221 14.9034 9.84146C14.8358 9.60324 14.8021 8.78648 14.8358 7.32311L14.8696 5.14507L15.1735 5.04297C15.3423 4.97491 15.4774 4.87281 15.5112 4.80475C15.545 4.66862 15.4099 4.66862 14.3631 4.66862C13.215 4.63459 13.1475 4.63459 13.1475 4.80475ZM21.0153 4.80475C21.0153 4.94088 21.0828 4.97491 21.2517 4.97491C21.6906 4.97491 21.927 5.14507 22.0283 5.51942C22.0958 5.72361 22.0958 6.71054 22.0958 8.10584C22.0621 10.6242 22.0283 10.7944 21.5218 10.8965C21.353 10.9305 21.2854 10.9985 21.2854 11.1006C21.2854 11.2368 21.353 11.2708 22.4673 11.2708C23.5478 11.2708 23.6491 11.2708 23.6491 11.1347C23.6491 11.0326 23.5478 10.9645 23.2777 10.8965C22.94 10.7944 22.9063 10.7603 22.805 10.4881C22.6699 10.0797 22.6699 6.23409 22.7712 6.26812C22.805 6.26812 23.1426 6.60844 23.5141 7.05085C23.8855 7.49327 24.8648 8.61632 25.7427 9.53518C27.0934 10.9985 27.3298 11.2708 27.5324 11.2708H27.7688L27.8025 8.276C27.8363 6.13199 27.8701 5.24716 27.9376 5.1791C28.0052 5.11104 28.174 5.04297 28.3091 5.00894C28.4779 4.97491 28.5792 4.90685 28.5792 4.83878C28.5792 4.73669 28.3766 4.70266 27.4311 4.70266C26.3168 4.66862 26.283 4.66862 26.283 4.83878C26.283 4.97491 26.3505 5.00894 26.4856 5.00894C26.5869 5.00894 26.7895 5.11104 26.9246 5.21313L27.161 5.41732L27.1947 7.45924C27.1947 8.61632 27.1947 9.50115 27.161 9.50115C27.1272 9.50115 26.8571 9.22889 26.5869 8.92261C26.3168 8.61632 25.5401 7.73149 24.8648 6.98279C24.1894 6.23409 23.4465 5.41732 23.2102 5.14507L22.805 4.66862H21.927C21.0491 4.63459 21.0153 4.63459 21.0153 4.80475ZM29.8624 4.80475C29.8624 4.94088 29.9299 4.97491 30.0987 4.97491C30.2338 4.97491 30.4026 5.04297 30.5039 5.11104C30.6728 5.21313 30.6728 5.38329 30.7066 7.73149C30.7403 10.6582 30.7066 10.8284 30.2 10.8965C29.9637 10.9305 29.8624 10.9985 29.8624 11.1006C29.8624 11.2368 29.9637 11.2708 31.1455 11.2708C32.3612 11.2708 32.4287 11.2708 32.4287 11.1006C32.4287 10.9645 32.3612 10.9305 32.2261 10.9305C32.1248 10.9305 31.9559 10.8624 31.8546 10.7944C31.6858 10.6923 31.6858 10.5221 31.652 8.00374C31.6183 5.41732 31.6183 5.31523 31.7871 5.14507C31.8884 5.04297 32.0573 4.97491 32.1586 4.97491C32.3274 4.97491 32.3612 4.94088 32.3612 4.80475C32.3612 4.63459 32.2936 4.63459 31.078 4.63459C29.9299 4.63459 29.8624 4.63459 29.8624 4.80475ZM38.7432 4.80475C38.777 4.90685 38.8445 4.97491 38.9796 4.97491C39.0809 4.97491 39.2497 5.07701 39.351 5.1791C39.4523 5.2812 40.0264 6.6765 40.668 8.34406L41.7823 11.3048L42.0862 11.3389L42.3901 11.3729L43.1668 9.26292C43.6057 8.10584 44.0109 7.05085 44.0447 6.94876C44.146 6.74457 44.146 6.7786 44.4161 7.45924C44.5512 7.86762 44.9564 8.88857 45.2941 9.7734L45.9019 11.3729H46.1721C46.3071 11.3729 46.4422 11.3389 46.476 11.2708C46.5097 11.2027 46.8812 10.2158 47.3539 9.05873C47.7929 7.90165 48.2994 6.60844 48.4682 6.20006C48.8397 5.24716 48.9072 5.14507 49.1774 5.04297C49.3124 5.00894 49.4137 4.90685 49.4137 4.83878C49.4137 4.73669 49.2449 4.70266 48.4007 4.70266C47.4552 4.70266 47.3877 4.70266 47.3877 4.87282C47.3877 5.00894 47.4552 5.04297 47.5903 5.04297C47.928 5.04297 48.063 5.14507 48.063 5.34926C48.063 5.51942 46.4422 9.90953 46.3409 10.0116C46.2734 10.0797 44.8214 5.99587 44.7876 5.58748C44.7201 5.21313 44.8889 5.04297 45.2603 5.04297C45.3954 5.04297 45.4629 5.00894 45.4629 4.87282C45.4629 4.70266 45.3954 4.70266 44.146 4.70266C42.8966 4.70266 42.8291 4.70266 42.8291 4.87282C42.8291 4.97491 42.8966 5.04297 42.9642 5.04297C43.2343 5.04297 43.572 5.31523 43.6733 5.55345C43.8083 5.9278 43.707 6.30215 42.9304 8.34406L42.2888 10.0797L42.1537 9.73937C42.0862 9.56921 41.681 8.48019 41.2758 7.35714C40.4654 5.14507 40.4654 5.04297 41.0056 5.04297C41.2082 5.04297 41.242 5.00894 41.242 4.87282C41.242 4.70266 41.1745 4.70266 39.9926 4.70266C38.7094 4.63459 38.6757 4.63459 38.7432 4.80475ZM55.8296 4.87282C55.8296 4.87282 55.8296 4.97491 55.8296 5.00894C55.8296 5.04297 55.9309 5.04297 55.9309 5.04297C55.9984 5.04297 56.0322 5.07701 56.0997 5.07701C56.3698 5.14507 56.5387 5.1791 56.6062 5.34926C56.64 5.45136 56.6737 5.85974 56.6737 8.00374C56.6737 10.2498 56.6737 10.5221 56.6062 10.6582C56.5387 10.8284 56.4036 10.9305 56.0659 11.0326C56.0659 11.0326 55.9309 11.0666 55.8971 11.1006C55.8633 11.1347 55.8633 11.2027 55.8633 11.2027C55.8633 11.2027 55.8633 11.2708 55.8971 11.3048C55.9309 11.3389 56.0322 11.3389 56.0322 11.3389H56.8764H58.2946C58.2946 11.3389 58.3621 11.3389 58.3959 11.3048C58.4297 11.2708 58.4297 11.2027 58.4297 11.2027C58.4297 11.2027 58.4297 11.1347 58.3959 11.1006C58.3621 11.0666 58.2271 11.0326 58.2271 11.0326C57.9231 10.9645 57.7543 10.8624 57.6868 10.6923C57.6192 10.5561 57.6192 10.2498 57.6192 9.53518V8.51422C57.653 8.54825 57.6868 8.54826 57.7205 8.58229C57.8894 8.68438 58.092 8.85454 58.8349 8.85454C59.7466 8.88857 60.2869 8.48019 60.6245 8.00374C60.9622 7.5273 61.0635 6.7786 60.8271 5.96183C60.5908 5.1791 59.8817 4.66862 58.9024 4.63459C58.3959 4.60056 57.6192 4.63459 57.214 4.66862H57.1127C56.7413 4.66862 56.2685 4.73669 56.0322 4.73669C55.9646 4.73669 55.9646 4.73669 55.9309 4.77072C55.8296 4.83878 55.8296 4.87282 55.8296 4.87282ZM59.5778 8.00374C59.9492 7.66343 59.9492 7.11892 59.9492 6.74457C59.9154 6.20006 59.6791 5.14507 58.4634 5.14507C58.1595 5.14507 57.5855 5.1791 57.5517 5.58748C57.5179 5.65555 57.5179 6.16603 57.5179 6.91473V8.13987L57.653 8.20794C57.7205 8.24197 57.8218 8.276 57.9569 8.31003C58.4634 8.44616 59.2063 8.34406 59.5778 8.00374ZM51.8112 4.73669C51.9125 4.70266 51.9801 4.66862 51.9801 4.66862C51.9801 4.66862 52.1151 4.60056 52.1489 4.66862C52.1489 4.70266 52.2164 4.80475 52.3515 5.14507C52.3853 5.21313 52.419 5.2812 52.419 5.34926C52.5879 5.82571 52.858 6.50634 52.9931 6.88069C53.1282 7.25504 53.3983 7.93568 53.6009 8.48019C53.8035 8.99067 54.0399 9.63727 54.175 9.94356C54.2763 10.2498 54.4451 10.5221 54.4789 10.5902C54.5126 10.6242 54.5126 10.6582 54.5464 10.6923C54.6477 10.8284 54.749 11.0326 54.9854 11.0666C54.9854 11.0666 55.1542 11.1006 55.188 11.1347C55.2217 11.1687 55.2217 11.2027 55.2217 11.2027V11.3048C55.2217 11.3048 55.2217 11.3389 55.188 11.3389C55.188 11.3729 55.1204 11.3389 55.1204 11.3389H53.7022H52.6892C52.6892 11.3389 52.6554 11.3389 52.6217 11.3389C52.5879 11.3389 52.5879 11.2708 52.5879 11.2708V11.2027C52.5879 11.2027 52.5879 11.1347 52.6217 11.1006C52.6554 11.0666 52.8243 11.0326 52.8243 11.0326C53.1282 10.9985 53.2632 10.7603 53.297 10.6242V10.5902C53.3645 10.454 53.3308 10.3519 53.0269 9.63727C52.8243 9.16083 52.7567 9.0247 52.723 8.99067C52.6892 8.99067 52.1489 8.99067 51.5749 8.99067H50.4605L50.393 9.16083C50.1904 9.70534 50.0216 10.2158 50.0216 10.3519C49.954 10.6242 50.0553 10.9645 50.4605 11.0326C50.4605 11.0326 50.6294 11.0666 50.6631 11.1006C50.6969 11.1347 50.7307 11.2027 50.7307 11.2027V11.2708C50.7307 11.2708 50.7307 11.3048 50.6969 11.3389C50.6631 11.3729 50.5956 11.3389 50.5956 11.3389H49.5488H48.5358C48.5358 11.3389 48.502 11.3389 48.4682 11.3048C48.4345 11.2708 48.4345 11.2368 48.4345 11.2368V11.1687C48.4345 11.1687 48.4345 11.1347 48.502 11.0666C48.5696 10.9985 48.7046 10.9985 48.7046 10.9985C48.9748 10.9645 49.1436 10.6582 49.2449 10.4881C49.2449 10.4881 49.2449 10.454 49.2787 10.454C49.3124 10.386 49.4813 10.0116 49.6501 9.60324C49.8189 9.19486 49.9878 8.71841 50.0553 8.58229C50.2579 8.07181 50.4605 7.59536 50.7644 6.84666C50.9333 6.43828 51.1697 5.82571 51.3047 5.48539L51.5411 4.87282L51.8112 4.73669ZM51.7437 6.20006C51.8112 6.33618 51.8788 6.54037 51.9125 6.64247C51.9463 6.74457 52.0814 7.05085 52.1827 7.32311C52.284 7.59536 52.419 7.90165 52.4866 8.03778C52.5541 8.1739 52.5879 8.276 52.5879 8.276C52.5879 8.276 52.1827 8.276 51.6762 8.276C51.1021 8.276 50.7644 8.276 50.7644 8.24197C50.7644 8.24197 50.7982 8.1739 50.7982 8.10584C50.832 8.00375 51.0346 7.45923 51.4398 6.30215C51.5073 6.13199 51.5749 5.96183 51.5749 5.9278C51.6086 5.9278 51.6424 5.96183 51.7437 6.20006Z" fill="#02171D" />
                                            </svg>

                                            <svg className='sharebutton' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M12.25 7.58333V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H6.41667" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12.25 1.75L7 7" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.75 1.75H12.25V5.25" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </a>
                                }
                                <h5 className='youget_text'>Remaining ETH<span className='dashesnew'> {remainingGems && percentage < 100 ? (3 - parseFloat(remainingGems))?.toFixed(6) : "--"}</span></h5>
                            </div>
                            <div className='inner_right'>
                                <h1>King of the Desert progress: <span>{isKingOfDesert ? 100 : kingOfDesertPercentage}%</span></h1>
                                <ProgressBar now={isKingOfDesert ? 100 : kingOfDesertPercentage} className='desertprogress' />
                                {!detail?.kingOfDessertStatus ? <p>Dethrone the current king at 1.5 ETH.</p> : ""}
                            </div>
                            <div className='holders_div'>
                                <div className='topholders'>
                                    <h1>Top Holders</h1>
                                </div>
                                {
                                    topHolder && topHolder?.length > 0 ? (
                                        topHolder?.map((item, index) => {
                                            return (
                                                <>
                                                    <div className='holder_bottom'>
                                                        <h3>{index + 1}.</h3>
                                                        {/* <h4>{item?.address?.slice(0, 6)}{item?.address?.toLowerCase() === detail?.creatorAddress?.toLowerCase() && " 🤵‍♂️ (dev)"}{item?.address?.toLowerCase() === bondingCurveWallet?.toLowerCase() && " 🏦 (bonding curve)"}<span>{item?.percentage}</span></h4> */}
                                                    </div>
                                                </>
                                            )
                                        })
                                    )
                                        :
                                        <p>Loading...</p>
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <section className='Main_chart phoneresponsive d-none'>
                <div className='top_chart'>
                    <div className='left_side'>
                        <div className='outer_side'>
                            <span className='span_chartt1'></span>
                            <div className='chart_topside'>
                                <div className='man_Div'>
                                    <img src={detail?.pfp ? detail?.pfp : 'asset/broken.png'} className='imageman1' />
                                    <div>
                                        <h1>{detail?.projectName}</h1>
                                        <p className='kevaiii'>${detail?.ticker}</p>
                                    </div>
                                </div>
                                <div className='top___side'>
                                    <div>
                                        <div className='outer_text'>
                                            <p>Price</p>
                                            <h1>$
                                                {formatTokenPrice(+tokenPrice, ethPrice) || '0.00'}
                                            </h1>
                                        </div>
                                        <div className='outer_text'>
                                            <p>Created By</p>
                                            <div className='small_imgdiv'>
                                                <h1>{getFormatedWeb3Address(detail?.creatorAddress, true)}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='end_side'>
                                        <div className='outer_text line__text'>
                                            <p className='marketcap'>Market Cap (FDV)</p>
                                            <p className='mcap d-none'>MCAP (FDV)</p>
                                            <h1>
                                                {detail?.isGraduated ? (+marketCap) >= 1 ? `$${formatMarketCap(+marketCap)}` : "< $1" : (+marketCap) >= 1 ? `$${formatEthinDollar(+marketCap, ethPrice)}` : "< $1"}</h1>
                                        </div>

                                        <div className='outer_text'>
                                            <p>Age</p>
                                            <h1>{lastTime}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='button_share_section'>
                                <div className='outer_text new_text_inside'>
                                    <p>CA:</p>
                                    <div>
                                        <h1>
                                            {detail?.contractAddress.slice(0, 8)}...{detail?.contractAddress.slice(-4)}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15"
                                                height="14"
                                                viewBox="0 0 15 14"
                                                fill="none"
                                                onClick={handleCopy}
                                                style={{ cursor: "pointer" }}
                                            >
                                                <g clipPath="url(#clip0_31_1059)">
                                                    <path
                                                        d="M12.2671 4.66675H6.43376C5.78942 4.66675 5.26709 5.18908 5.26709 5.83341V11.6667C5.26709 12.3111 5.78942 12.8334 6.43376 12.8334H12.2671C12.9114 12.8334 13.4338 12.3111 13.4338 11.6667V5.83341C13.4338 5.18908 12.9114 4.66675 12.2671 4.66675Z"
                                                        stroke="#E59572"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.93376 9.33342C2.29209 9.33342 1.76709 8.80842 1.76709 8.16675V2.33341C1.76709 1.69175 2.29209 1.16675 2.93376 1.16675H8.76709C9.40876 1.16675 9.93376 1.69175 9.93376 2.33341"
                                                        stroke="#E59572"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_31_1059">
                                                        <rect
                                                            width="14"
                                                            height="14"
                                                            fill="white"
                                                            transform="translate(0.600098)"
                                                        />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </h1>
                                        {copied && <p style={{ color: "#E59572", marginTop: "5px" }}>Copied!</p>} {/* Show "Copied" message */}
                                    </div>
                                </div>
                                <button onClick={() => handleShare(window?.location?.href)}><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M16.148 7.71048L12.773 11.0855C12.6674 11.191 12.5243 11.2503 12.375 11.2503C12.2257 11.2503 12.0826 11.191 11.977 11.0855C11.8715 10.9799 11.8122 10.8368 11.8122 10.6875C11.8122 10.5382 11.8715 10.3951 11.977 10.2895L14.3923 7.87501H11.6016C10.2295 7.87463 8.89628 8.33029 7.81147 9.17033C6.72667 10.0104 5.95184 11.1872 5.60883 12.5156C5.57153 12.6602 5.47835 12.7839 5.34979 12.8598C5.22122 12.9356 5.0678 12.9572 4.92328 12.9199C4.77876 12.8826 4.65497 12.7895 4.57915 12.6609C4.50333 12.5323 4.48169 12.3789 4.51898 12.2344C4.92371 10.664 5.83928 9.27279 7.12152 8.27989C8.40377 7.28699 9.97984 6.74878 11.6016 6.75001H14.3937L11.977 4.33548C11.9248 4.28321 11.8833 4.22117 11.855 4.15289C11.8267 4.0846 11.8122 4.01142 11.8122 3.93751C11.8122 3.8636 11.8267 3.79041 11.855 3.72213C11.8833 3.65384 11.9248 3.5918 11.977 3.53954C12.0826 3.43399 12.2257 3.37469 12.375 3.37469C12.4489 3.37469 12.5221 3.38925 12.5904 3.41754C12.6587 3.44582 12.7207 3.48728 12.773 3.53954L16.148 6.91454C16.2003 6.96678 16.2418 7.02882 16.2701 7.0971C16.2984 7.16539 16.3129 7.23859 16.3129 7.31251C16.3129 7.38643 16.2984 7.45963 16.2701 7.52791C16.2418 7.5962 16.2003 7.65824 16.148 7.71048ZM13.5 14.625H2.8125V6.18751C2.8125 6.03832 2.75324 5.89525 2.64775 5.78976C2.54226 5.68427 2.39918 5.62501 2.25 5.62501C2.10082 5.62501 1.95774 5.68427 1.85225 5.78976C1.74676 5.89525 1.6875 6.03832 1.6875 6.18751V15.1875C1.6875 15.3367 1.74676 15.4798 1.85225 15.5853C1.95774 15.6907 2.10082 15.75 2.25 15.75H13.5C13.6492 15.75 13.7923 15.6907 13.8977 15.5853C14.0032 15.4798 14.0625 15.3367 14.0625 15.1875C14.0625 15.0383 14.0032 14.8953 13.8977 14.7898C13.7923 14.6843 13.6492 14.625 13.5 14.625Z" fill="#311E1A" />
                                </svg>Share</button>
                            </div>

                            <div id="chart">
                                {!!uniSwapPoolAddreess || detail?.isGraduated ?
                                    <iframe
                                        key={iframeKey}
                                        id="dextools-widget"
                                        width="100%"
                                        height="400"
                                        src={iframeSrc}>
                                    </iframe>
                                    :
                                    <>
                                        TradingViewChart
                                        {/* <TradingViewChart initialData={initialData} liveData={liveData} /> */}
                                    </>
                                }
                            </div>
                        </div>
                        <div className='trade_charttabs'>
                            <div className="d-flex align-items-start sellbuy_tab2">
                                <div className='tabbbs_data '>
                                    <div className="nav  nav-pills me-3 tabbss_div2" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                        <button className="nav-link active" id="v-pills-Trade-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Trade" type="button" role="tab" aria-controls="v-pills-Trade" aria-selected="true">Trade</button>
                                        <button className="nav-link" id="v-pills-Info-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Info" type="button" role="tab" aria-controls="v-pills-Info" aria-selected="false">Info</button>
                                        <button className="nav-link" id="v-pills-Thread-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Thread" type="button" role="tab" aria-controls="v-pills-Thread" aria-selected="false">Thread</button>
                                        <button className="nav-link" id="v-pills-Threadnew-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Threadnew" type="button" role="tab" aria-controls="v-pills-Threadnew" aria-selected="false">Transactions</button>

                                    </div>
                                </div>
                                <div className='tabs__lower'>
                                    <div className="tab-content" id="v-pills-tabContent">
                                        <div className="tab-pane fade show active mydatttta" id="v-pills-Trade" role="tabpanel" aria-labelledby="v-pills-Trade-tab">
                                            <div className='right_side'>
                                                <div className='tabs_div'>
                                                    <div className="d-flex align-items-start sellbuy_tab">
                                                        <div className='tabbbs_data '>
                                                            <div className="nav  nav-pills me-3 tabbss_div" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                                <button className="nav-link active" id="v-pills-homesmall-tab" data-bs-toggle="pill" data-bs-target="#v-pills-homesmall" type="button" role="tab" aria-controls="v-pills-homesmall" aria-selected="true">Buy</button>
                                                                <button className="nav-link" id="v-pills-profilesmall-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profilesmall" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Sell</button>
                                                            </div>
                                                        </div>
                                                        <div className='tabs__lower'>
                                                            <div className="tab-content" id="v-pills-tabContent">
                                                                <div className="tab-pane fade show active mydatttta" id="v-pills-homesmall" role="tabpanel" aria-labelledby="v-pills-homesmall-tab">
                                                                    <div className='tab_buy'>
                                                                        <div className='balance_div'>
                                                                            <p>Balance</p>
                                                                            {/* <h1>{(+ethBalance)?.toFixed(6)} ETH</h1> */}
                                                                        </div>
                                                                        <div className='gemsdiv'>
                                                                            <div>
                                                                                <h2>Amount</h2>
                                                                                <input type="number" min={0} placeholder='0.00' id="fname" name="fname" className='inputamount' value={tradeAmount} onChange={(e) => setTradeAmount(e.target.value)} />

                                                                            </div>
                                                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                                <g clip-path="url(#clip0_1158_273)">
                                                                                    <path d="M1.62732 5.47242V12.5284C1.62732 12.982 1.86492 13.3924 2.26092 13.6228L8.37372 17.1508C8.76252 17.374 9.24492 17.374 9.63372 17.1508L15.7465 13.6228C16.1353 13.3996 16.3801 12.982 16.3801 12.5284V5.47242C16.3801 5.01882 16.1425 4.60842 15.7465 4.37802L9.63372 0.850017C9.24492 0.626817 8.76252 0.626817 8.37372 0.850017L2.26092 4.37802C1.87212 4.60122 1.63452 5.01882 1.63452 5.47242H1.62732Z" fill="#213147" />
                                                                                    <path d="M10.3321 10.3677L9.4609 12.7581C9.4393 12.8229 9.4393 12.8949 9.4609 12.9669L10.9585 17.0781L12.6937 16.0773L10.6129 10.3677C10.5625 10.2381 10.3825 10.2381 10.3321 10.3677Z" fill="#12AAFF" />
                                                                                    <path d="M12.0817 6.35013C12.0313 6.22053 11.8513 6.22053 11.8009 6.35013L10.9297 8.74053C10.9081 8.80533 10.9081 8.87733 10.9297 8.94933L13.3849 15.6813L15.1201 14.6805L12.0817 6.35733V6.35013Z" fill="#12AAFF" />
                                                                                    <path d="M9.00006 1.116C9.04326 1.116 9.08646 1.1304 9.12246 1.152L15.7321 4.968C15.8113 5.0112 15.8545 5.0976 15.8545 5.184V12.816C15.8545 12.9024 15.8041 12.9888 15.7321 13.032L9.12246 16.848C9.08646 16.8696 9.04326 16.884 9.00006 16.884C8.95686 16.884 8.91366 16.8696 8.87766 16.848L2.26806 13.032C2.18886 12.9888 2.14566 12.9024 2.14566 12.816V5.1768C2.14566 5.0904 2.19606 5.004 2.26806 4.9608L8.87766 1.1448C8.91366 1.1232 8.95686 1.1088 9.00006 1.1088V1.116ZM9.00006 0C8.76246 0 8.53206 0.0576 8.31606 0.18L1.70646 3.996C1.28166 4.2408 1.02246 4.6872 1.02246 5.1768V12.8088C1.02246 13.2984 1.28166 13.7448 1.70646 13.9896L8.31606 17.8056C8.52486 17.928 8.76246 17.9856 9.00006 17.9856C9.23766 17.9856 9.46806 17.928 9.68406 17.8056L16.2937 13.9896C16.7185 13.7448 16.9777 13.2984 16.9777 12.8088V5.1768C16.9777 4.6872 16.7185 4.2408 16.2937 3.996L9.67686 0.18C9.46806 0.0576 9.23046 0 8.99286 0H9.00006Z" fill="#9DCCED" />
                                                                                    <path d="M4.62244 15.689L5.23444 14.0186L6.45844 15.0338L5.31364 16.085L4.62244 15.689Z" fill="#213147" />
                                                                                    <path d="M8.43841 4.63708H6.76081C6.63841 4.63708 6.52321 4.71628 6.48001 4.83148L2.88721 14.6811L4.62241 15.6819L8.58241 4.83148C8.61841 4.73068 8.54641 4.62988 8.44561 4.62988L8.43841 4.63708Z" fill="white" />
                                                                                    <path d="M11.376 4.63708H9.6984C9.576 4.63708 9.4608 4.71628 9.4176 4.83148L5.3136 16.0779L7.0488 17.0787L11.5128 4.83148C11.5488 4.73068 11.4768 4.62988 11.376 4.62988V4.63708Z" fill="white" />
                                                                                </g>
                                                                                <defs>
                                                                                    <clipPath id="clip0_1158_273">
                                                                                        <rect width="18" height="18" fill="white" />
                                                                                    </clipPath>
                                                                                </defs>
                                                                            </svg>
                                                                                ETH</h4>
                                                                        </div>
                                                                        <h5 className='youget_text'>You Get<span className='dashes'>{rockGet ? parseFloat(rockGet)?.toFixed(2) : "--"}</span></h5>
                                                                        <button
                                                                        // className={tradeAmount == 0 || +ethBalance < +tradeAmount ? "disabled" : ""}
                                                                        // onClick={() => {
                                                                        //     handleBuyTrade();
                                                                        // }}
                                                                        // disabled={tradeAmount == 0 || +ethBalance < +tradeAmount}
                                                                        >
                                                                            {
                                                                                isTransactionOcurring ? (
                                                                                    <svg className='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                                                                        <radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#311E1A'></stop><stop offset='.3' stop-color='#311E1A' stop-opacity='.9'></stop><stop offset='.6' stop-color='#311E1A' stop-opacity='.6'></stop><stop offset='.8' stop-color='#311E1A' stop-opacity='.3'></stop><stop offset='1' stop-color='#311E1A' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='21' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#311E1A' stroke-width='21' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                                                                                    </svg>
                                                                                ) : ('Place Trade')
                                                                            }
                                                                        </button>
                                                                        <div className='powerdby'>
                                                                            <h2>Powered by</h2>
                                                                            <a href='https://gems.vip/' target='blank'>
                                                                                <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                                    <path d="M3.3792 2.40004L1.20044 4.68036V6.15937L6.00151 10.8L10.8004 6.16186V5.56461H4.93851L5.34475 6.79767H8.07217L6.00108 8.80052L2.71128 5.61936L4.38171 3.87325H7.62046L8.33427 4.62022H10.531V4.39874L8.62125 2.40004H3.3792Z" fill="#329879" />
                                                                                </svg> Gems</h4></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="tab-pane fade" id="v-pills-profilesmall" role="tabpanel" aria-labelledby="v-pills-profilesmall-tab">
                                                                    <div className='tab_buy'>
                                                                        <div className='balance_div'>
                                                                            <p>Balance</p>
                                                                            <h1>{(+rockBalance)?.toFixed(2)} {detail?.projectName}</h1>
                                                                        </div>
                                                                        <div className='gemsdiv'>
                                                                            <div>
                                                                                <h2>Amount</h2>
                                                                                <input type="number" min={0} placeholder='0.00' id="fname" name="fname" className='inputamount' value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} />

                                                                            </div>
                                                                            <h4>{detail?.ticker}</h4>
                                                                        </div>
                                                                        <div className='gems_inner'>
                                                                            {/* <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.25).toString())}>25%</h5>
                                                                            <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.50).toString())}>50%</h5>
                                                                            <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 0.75).toString())}>75%</h5>
                                                                            <h5 onClick={() => setSellAmount(Math.floor(rockBalance * 1.00).toString())}>100%</h5> */}

                                                                        </div>
                                                                        <h5 className='youget_text'>You Get<span className='dashes'>{gemGet ? (parseFloat(gemGet) * 0.99)?.toFixed(6) : "--"}</span></h5>
                                                                        <button
                                                                            className={+sellAmount == 0 || +rockBalance < +sellAmount ? "disabled" : ""}
                                                                            onClick={() => {
                                                                                handleSellTrade();
                                                                            }}
                                                                            disabled={+sellAmount == 0 || +rockBalance < +sellAmount}
                                                                        >
                                                                            {
                                                                                isTransactionOcurring ? (
                                                                                    <svg className='spinner' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>
                                                                                        <radialGradient id='a12' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#311E1A'></stop><stop offset='.3' stop-color='#311E1A' stop-opacity='.9'></stop><stop offset='.6' stop-color='#311E1A' stop-opacity='.6'></stop><stop offset='.8' stop-color='#311E1A' stop-opacity='.3'></stop><stop offset='1' stop-color='#311E1A' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a12)' stroke-width='21' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#311E1A' stroke-width='21' stroke-linecap='round' cx='100' cy='100' r='70'></circle>
                                                                                    </svg>
                                                                                ) : ('Place Trade')
                                                                            }
                                                                        </button>
                                                                        <div className='powerdby'>
                                                                            <h2>Powered by</h2>
                                                                            <a href='https://gems.vip/' target='blank'>
                                                                                <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                                    <path d="M3.3792 2.40004L1.20044 4.68036V6.15937L6.00151 10.8L10.8004 6.16186V5.56461H4.93851L5.34475 6.79767H8.07217L6.00108 8.80052L2.71128 5.61936L4.38171 3.87325H7.62046L8.33427 4.62022H10.531V4.39874L8.62125 2.40004H3.3792Z" fill="#329879" />
                                                                                </svg> Gems </h4></a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                <div className='swap_side'>
                                                    <img src='\asset\svgicons.svg' className='arrrowimgss' />
                                                    <h1>Swap</h1>
                                                    <div className='swap_inner'>
                                                        <div>
                                                            <p>From</p>
                                                            <h2>0.00</h2>
                                                        </div>
                                                        <div className='dropdown_swap swap_side2'>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                                                        <path d="M4.78701 3.3999L1.70044 6.63035V8.72561L8.50196 15.2999L15.3004 8.72914V7.88304H6.99605L7.57155 9.62988H11.4354L8.50135 12.4672L3.8408 7.9606L6.20724 5.48694H10.7955L11.8067 6.54515H14.9188V6.23139L12.2133 3.3999H4.78701Z" fill="#329879" />
                                                                    </svg> Gems<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                                                                        <path d="M3.5 5.75L7 9.25L10.5 5.75" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg>
                                                                </Dropdown.Toggle>

                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item href="#/action-1">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                            <g clip-path="url(#clip0_46_4432)">
                                                                                <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="white" />
                                                                                <path d="M6.72345 5L4 7.98613V9.92292L10.0013 16L16 9.92618V9.14408H8.67259L9.18039 10.7588H12.5897L10.0008 13.3816L5.88856 9.21577L7.97659 6.9292H12.025L12.9173 7.90737H15.6633V7.61734L13.276 5H6.72345Z" fill="#329879" />
                                                                            </g>
                                                                            <defs>
                                                                                <clipPath id="clip0_46_4432">
                                                                                    <rect width="20" height="20" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                        <h2>GEMS <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </svg></h2>
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item href="#/action-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <g clip-path="url(#clip0_46_4446)">
                                                                            <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#627EEA" />
                                                                            <path d="M10.3113 2.5V8.04375L14.9969 10.1375L10.3113 2.5Z" fill="white" fill-opacity="0.602" />
                                                                            <path d="M10.3112 2.5L5.625 10.1375L10.3112 8.04375V2.5Z" fill="white" />
                                                                            <path d="M10.3113 13.7298V17.4966L15 11.0098L10.3113 13.7298Z" fill="white" fill-opacity="0.602" />
                                                                            <path d="M10.3112 17.4966V13.7291L5.625 11.0098L10.3112 17.4966Z" fill="white" />
                                                                            <path d="M10.3113 12.858L14.9969 10.1374L10.3113 8.04492V12.858Z" fill="white" fill-opacity="0.2" />
                                                                            <path d="M5.625 10.1374L10.3112 12.858V8.04492L5.625 10.1374Z" fill="white" fill-opacity="0.602" />
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_46_4446">
                                                                                <rect width="20" height="20" fill="white" />
                                                                            </clipPath>
                                                                        </defs>
                                                                    </svg> ETH</Dropdown.Item>
                                                                    <Dropdown.Item href="#/action-3"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <path d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z" fill="#F3BA2F" />
                                                                        <path d="M7.5725 9.0025L10 6.575L12.4288 9.00375L13.8412 7.59125L10 3.75L6.16 7.59L7.5725 9.0025ZM3.75 10L5.1625 8.5875L6.575 10L5.1625 11.4125L3.75 10ZM7.5725 10.9975L10 13.425L12.4288 10.9963L13.8412 12.4081L10 16.25L6.16 12.41L6.15812 12.4081L7.5725 10.9975ZM13.425 10L14.8375 8.5875L16.25 10L14.8375 11.4125L13.425 10ZM11.4325 9.99875H11.4338V10L10 11.4338L8.56812 10.0025L8.56563 10L8.56812 9.99813L8.81875 9.74688L8.94063 9.625L10 8.56625L11.4331 9.99937L11.4325 9.99875Z" fill="white" />
                                                                    </svg> BNB</Dropdown.Item>
                                                                    <Dropdown.Item href="#/action-3"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <path d="M14.6422 1.75969C14.1217 2.27429 13.6449 2.83203 13.2211 3.42675L13.0871 3.38361C12.3142 3.13401 11.5132 2.97994 10.7061 2.92756C10.463 2.90907 9.55608 2.90907 9.26002 2.92756C8.36558 2.98611 7.67996 3.11861 6.90083 3.38669C6.86967 3.39902 6.84162 3.40826 6.81357 3.41751C6.37414 2.82587 5.88486 2.27121 5.3457 1.76277C7.93239 0.453164 10.9585 0.29601 13.6667 1.32829C13.9566 1.43614 14.2402 1.56248 14.5175 1.69806L14.6422 1.75969Z" fill="#F00500" />
                                                                        <path d="M19.4664 13.4477C19.0737 14.554 18.4847 15.5801 17.7211 16.4737C17.3066 16.9544 16.8485 17.395 16.3561 17.7956C15.203 18.7139 13.8567 19.3702 12.42 19.7154C10.8306 20.0944 9.17259 20.0944 7.58318 19.7154C6.14336 19.3702 4.80016 18.7139 3.64705 17.7956C3.15465 17.395 2.69652 16.9544 2.28203 16.4737C0.0848998 13.9069 -0.58203 10.3817 0.536791 7.20473C0.748713 6.61618 1.01361 6.04919 1.3315 5.50994C1.47797 5.26343 1.65873 4.9861 1.74599 4.87208C2.04518 6.14472 2.41292 7.26328 2.55005 7.66695C2.5407 7.68852 2.52823 7.71317 2.51576 7.73474C1.78962 9.18918 1.39694 10.5912 1.30345 12.0826C1.30345 12.1011 1.30033 12.1227 1.30033 12.1412C1.2754 12.588 1.28787 12.8006 1.36266 13.081C1.5964 13.9592 2.31631 14.9268 3.44448 15.8759C5.29256 17.4289 7.79822 18.5506 9.69616 18.68C11.6751 18.8125 14.5953 17.6693 16.54 15.9992C16.8454 15.7311 17.1321 15.4476 17.4001 15.1456C17.5934 14.9237 17.8801 14.5416 17.8583 14.5416C17.852 14.5416 17.8583 14.5355 17.8707 14.5293C17.8801 14.5231 17.8894 14.5139 17.8832 14.5077C17.8801 14.5047 17.8863 14.4954 17.8957 14.4923C17.905 14.4893 17.9112 14.4831 17.9081 14.4769C17.905 14.4708 17.9081 14.4646 17.9206 14.4615C17.9299 14.4584 17.9331 14.4492 17.9299 14.443C17.9268 14.4369 17.9299 14.4307 17.9362 14.4307C17.9424 14.4307 17.9486 14.4215 17.9486 14.4153C17.9486 14.4091 17.9549 14.3999 17.9611 14.3999C17.9673 14.3999 17.9736 14.3937 17.9736 14.3876C17.9829 14.3629 17.9985 14.3383 18.0141 14.3167C18.0608 14.2458 18.2478 13.9161 18.2728 13.8606C18.4504 13.4631 18.5626 13.1088 18.6156 12.7544C18.6405 12.5849 18.6561 12.2737 18.6436 12.1997C18.6405 12.1874 18.6405 12.1658 18.6374 12.132C18.6311 12.0703 18.628 11.9779 18.6218 11.8854C18.6156 11.7468 18.6031 11.5526 18.5938 11.4571C18.4597 10.0581 18.0982 8.91493 17.4126 7.70392C17.3846 7.6577 17.3596 7.61148 17.344 7.5745C17.3378 7.56526 17.3347 7.55602 17.3316 7.54985C17.4282 7.26328 17.824 6.0646 18.1387 4.69336L18.145 4.69952L18.1917 4.76115C18.2728 4.869 18.4878 5.18947 18.5844 5.34354C19.0238 6.05227 19.3666 6.81339 19.6097 7.6084C20.1738 9.52197 20.1271 11.5619 19.4664 13.4477Z" fill="#F00500" />
                                                                        <path d="M15.4211 9.76537C15.4118 9.81467 15.2653 9.96258 15.1188 10.0704C14.6887 10.3817 13.919 10.6713 13.1367 10.81C12.6911 10.8901 12.2454 10.9024 12.1114 10.8377C12.0241 10.7946 12.0117 10.7607 12.0428 10.6497C12.1083 10.4186 12.3202 10.166 12.6506 9.92869C12.8188 9.80851 13.5014 9.39868 13.8192 9.22612C14.3428 8.94263 14.7667 8.77315 15.0534 8.73309C15.1437 8.72076 15.2528 8.71768 15.2871 8.73309C15.3432 8.75466 15.4055 8.91797 15.4305 9.11519C15.4429 9.21995 15.4367 9.68217 15.4211 9.76537Z" fill="black" />
                                                                        <path d="M8.07868 10.7851C8.05998 10.822 7.96649 10.8621 7.86052 10.8775C7.75456 10.8929 7.43045 10.8837 7.24658 10.8621C6.58588 10.7758 5.88467 10.5755 5.37357 10.329C5.08685 10.1903 4.88116 10.0517 4.72845 9.90069L4.64119 9.81133L4.63184 9.69423C4.61626 9.49086 4.61937 9.17039 4.64431 9.05638C4.65989 8.96085 4.69417 8.86841 4.74092 8.78521C4.76585 8.75439 4.76585 8.75439 4.87804 8.75439C5.01517 8.75439 5.13048 8.77597 5.31747 8.83451C5.7008 8.95161 6.27111 9.2351 6.96609 9.64801C7.53953 9.98697 7.75456 10.1534 7.91974 10.3814C8.03193 10.5231 8.10673 10.7234 8.07868 10.7851Z" fill="black" />
                                                                        <path d="M12.4917 15.0746C12.4917 15.0839 12.4543 15.2318 12.4076 15.4074C12.3608 15.5831 12.3234 15.7248 12.3234 15.731C12.2892 15.7341 12.258 15.7371 12.2237 15.7341H12.124L11.9869 16.0545C11.9121 16.2302 11.8435 16.3935 11.8342 16.4181L11.8155 16.4613L11.75 16.3565L11.6846 16.2517V15.3982L11.6596 15.4043C11.6066 15.4167 11.2296 15.466 11.0644 15.4814C10.3819 15.5492 9.69624 15.5338 9.01684 15.4382C8.90776 15.4228 8.81427 15.4105 8.81115 15.4136C8.80804 15.4167 8.81116 15.6139 8.81739 15.8573L8.82674 16.2949L8.77376 16.375C8.74571 16.4181 8.71766 16.4551 8.71766 16.4582C8.70831 16.4674 8.67714 16.4181 8.60546 16.2764C8.52755 16.1285 8.47146 15.9713 8.43094 15.808L8.40912 15.7186L8.31251 15.7248L8.2159 15.7341L8.19097 15.62C8.1785 15.5584 8.16292 15.4629 8.15669 15.4105L8.14734 15.3119L8.06631 15.241C8.01956 15.201 7.97282 15.1609 7.96347 15.1547C7.94789 15.1424 7.94165 15.1208 7.94165 15.1024V15.0654L8.33121 15.0685L8.72077 15.0715L8.73324 15.1116L8.74571 15.1517L8.87972 15.1578C8.95451 15.1609 9.19136 15.1671 9.40329 15.1732L9.79285 15.1825L9.89258 15.0284L9.99542 14.8743H10.1263L10.1232 14.5539L10.1201 14.2334L9.94867 14.1594C9.39705 13.9191 9.07294 13.6448 8.95139 13.312C8.92646 13.2442 8.92646 13.2196 8.92023 12.9115C8.91711 12.6064 8.91711 12.5787 8.93893 12.5109C8.98256 12.3568 9.1041 12.2366 9.25993 12.1966C9.31291 12.1812 9.45315 12.1812 10.1886 12.1812L11.055 12.1842L11.1516 12.2305C11.2669 12.2859 11.3199 12.326 11.3854 12.4123C11.4602 12.5109 11.482 12.5879 11.482 12.7759C11.482 13.044 11.4633 13.2751 11.4352 13.3675C11.3947 13.4938 11.3324 13.614 11.2545 13.7219C11.0987 13.9191 10.8151 14.1163 10.5564 14.2057L10.4816 14.2334L10.4847 14.5569L10.4878 14.8805L10.5564 14.8867L10.625 14.8928L10.7184 15.0315L10.8088 15.1701H11.2264C11.4571 15.1701 11.6596 15.1732 11.6783 15.1763C11.7095 15.1825 11.7157 15.1794 11.7469 15.127L11.7843 15.0715H12.1427C12.4107 15.0592 12.4917 15.0654 12.4917 15.0746Z" fill="black" />
                                                                        <path d="M10.8461 15.9592C10.7869 15.9931 10.7464 16.0085 10.737 16.0023C10.7277 15.9992 10.6841 15.9623 10.6373 15.9284L10.5532 15.8606L10.4659 15.953C10.2758 16.1564 10.2696 16.1656 10.2135 16.1687C10.1262 16.178 10.1075 16.1626 10.0015 16.0054C9.94545 15.9253 9.90182 15.8575 9.90182 15.8575C9.90182 15.8575 9.8613 15.8513 9.81456 15.8483L9.72729 15.839L9.68678 15.9222L9.64627 16.0054L9.57458 15.9838C9.51849 15.9654 9.46239 15.9438 9.40941 15.9191L9.31592 15.8729V15.6973L10.1449 15.7003L10.9739 15.7034L10.977 15.7866C10.9801 15.8852 10.9832 15.8822 10.8461 15.9592Z" fill="black" />
                                                                        <path d="M18.6373 12.1996C18.6342 12.1873 18.6342 12.1657 18.6311 12.1319C17.8831 12.0517 15.7483 12.0024 13.7662 13.6202C13.7662 13.6202 13.1273 10.7236 10.1355 10.7236C7.14367 10.7236 6.0342 13.6202 6.0342 13.6202C4.35752 11.836 2.11365 11.9655 1.30336 12.0825C1.30336 12.101 1.30024 12.1226 1.30024 12.1411C1.27531 12.5879 1.28778 12.8005 1.36257 13.0809C1.59631 13.9591 2.31622 14.9267 3.44439 15.8758C5.29247 17.4288 7.79813 18.5505 9.69608 18.6799C11.675 18.8124 14.5952 17.6692 16.5399 15.9991C16.8453 15.731 17.132 15.4475 17.4 15.1455C17.5933 14.9236 17.88 14.5415 17.8582 14.5415C17.8519 14.5415 17.8582 14.5354 17.8706 14.5292C17.88 14.523 17.8893 14.5138 17.8831 14.5076C17.88 14.5046 17.8862 14.4953 17.8956 14.4922C17.9049 14.4892 17.9112 14.483 17.908 14.4768C17.9049 14.4707 17.908 14.4645 17.9205 14.4614C17.9299 14.4583 17.933 14.4491 17.9298 14.4429C17.9267 14.4368 17.9299 14.4306 17.9361 14.4306C17.9423 14.4306 17.9486 14.4214 17.9486 14.4152C17.9486 14.409 17.9548 14.3998 17.961 14.3998C17.9672 14.3998 17.9735 14.3936 17.9735 14.3875C17.9828 14.3628 17.9984 14.3382 18.014 14.3166C18.0607 14.2457 18.2477 13.916 18.2727 13.8605C18.4503 13.463 18.5625 13.1087 18.6155 12.7543C18.6342 12.5848 18.6498 12.2736 18.6373 12.1996ZM10.8461 15.959C10.7868 15.9929 10.7463 16.0083 10.737 16.0021C10.7276 15.9991 10.684 15.9621 10.6373 15.9282L10.5531 15.8604L10.4658 15.9528C10.2757 16.1562 10.2695 16.1655 10.2134 16.1685C10.1262 16.1778 10.1075 16.1624 10.0015 16.0052C9.9454 15.9251 9.90176 15.8573 9.90176 15.8573C9.90176 15.8573 9.86125 15.8511 9.8145 15.8481L9.72724 15.8388L9.68672 15.922L9.64621 16.0052L9.57453 15.9836C9.51843 15.9652 9.46234 15.9436 9.40936 15.9189L9.31587 15.8727V15.6971L10.1449 15.7002L10.9738 15.7032L10.977 15.7864C10.9801 15.885 10.9832 15.882 10.8461 15.959ZM12.4043 15.4043C12.3576 15.58 12.3202 15.7217 12.3202 15.7279C12.2859 15.731 12.2547 15.7341 12.2204 15.731H12.1207L11.9867 16.0545C11.9119 16.2302 11.8433 16.3935 11.834 16.4181L11.8153 16.4613L11.7498 16.3565L11.6844 16.2517V15.3982L11.6595 15.4043C11.6065 15.4167 11.2294 15.466 11.0642 15.4814C10.3817 15.5492 9.69607 15.5338 9.01668 15.4382C8.9076 15.4228 8.81411 15.4105 8.81099 15.4136C8.80788 15.4167 8.81099 15.6139 8.81723 15.8573L8.82657 16.2949L8.77359 16.375C8.74555 16.4181 8.7175 16.4551 8.7175 16.4582C8.70815 16.4674 8.67698 16.4181 8.6053 16.2764C8.52739 16.1285 8.4713 15.9713 8.43078 15.808L8.40896 15.7186L8.31235 15.7248L8.21574 15.7341L8.19081 15.62C8.17834 15.5584 8.16276 15.4629 8.15653 15.4105L8.14718 15.3119L8.06615 15.241C8.0194 15.201 7.97266 15.1609 7.96331 15.1547C7.94772 15.1424 7.94149 15.1208 7.94149 15.1024V15.0654L8.33105 15.0685L8.72061 15.0715L8.73308 15.1116L8.74555 15.1517L8.87956 15.1578C8.95435 15.1609 9.1912 15.1671 9.40312 15.1732L9.79269 15.1825L9.89242 15.0284L9.99526 14.8743H10.1262L10.123 14.5539L10.1199 14.2334L9.94851 14.1594C9.39689 13.9191 9.07278 13.6448 8.95123 13.312C8.9263 13.2442 8.9263 13.2196 8.92007 12.9115C8.91695 12.6064 8.91695 12.5787 8.93877 12.5109C8.9824 12.3568 9.10394 12.2366 9.25977 12.1966C9.31275 12.1812 9.45299 12.1812 10.1885 12.1812L11.0549 12.1842L11.1515 12.2305C11.2668 12.2859 11.3198 12.326 11.3852 12.4123C11.46 12.5109 11.4818 12.5879 11.4818 12.7759C11.4818 13.044 11.4631 13.2751 11.4351 13.3675C11.3946 13.4938 11.3322 13.614 11.2543 13.7219C11.0985 13.9191 10.8149 14.1163 10.5562 14.2057L10.4814 14.2334L10.4845 14.5569L10.4877 14.8805L10.5562 14.8867L10.6248 14.8928L10.7183 15.0315L10.8087 15.1701H11.2263C11.4569 15.1701 11.6595 15.1732 11.6782 15.1763C11.7093 15.1825 11.7156 15.1794 11.7467 15.127L11.7841 15.0715H12.1425C12.4199 15.0715 12.5009 15.0746 12.5009 15.0839C12.4916 15.0808 12.4511 15.2318 12.4043 15.4043Z" fill="white" />
                                                                        <path d="M18.6124 11.8853C18.6061 11.7466 18.5937 11.5525 18.5843 11.457C18.4503 10.058 18.0888 8.91478 17.4032 7.70377C17.3751 7.65755 17.3502 7.61133 17.3346 7.57435C17.3284 7.56511 17.3252 7.55586 17.3221 7.5497C17.4187 7.26313 17.8145 6.06445 18.1293 4.69321C18.5563 2.83202 18.8274 0.656523 17.9984 0.00325808C17.9984 0.00325808 16.5648 -0.101511 14.6451 1.75968C14.1246 2.27428 13.6478 2.83202 13.2239 3.42674L13.0899 3.3836C12.317 3.134 11.5161 2.97993 10.7089 2.92754C10.4658 2.90905 9.55894 2.90905 9.26287 2.92754C8.36844 2.98609 7.68281 3.11859 6.90369 3.38668C6.87253 3.399 6.84448 3.40825 6.81643 3.41749C6.377 2.82586 5.88771 2.2712 5.34856 1.76276C3.35089 -0.107674 1.86432 0.000176456 1.86432 0.000176456C0.98547 0.675011 1.28465 2.94911 1.73966 4.87193C2.03884 6.14457 2.40659 7.26313 2.54372 7.66679C2.53437 7.68836 2.5219 7.71302 2.50944 7.73459C1.78329 9.18903 1.39061 10.5911 1.29712 12.0825C2.11052 11.9654 4.35128 11.8329 6.03107 13.6201C6.03107 13.6201 7.14054 10.7236 10.1324 10.7236C13.1242 10.7236 13.7631 13.6201 13.7631 13.6201C15.7452 12.0024 17.88 12.0548 18.6279 12.1318C18.6248 12.0702 18.6186 11.9777 18.6124 11.8853ZM3.13273 6.50509C3.13273 6.50509 1.96716 3.62395 2.26635 1.97846C2.31621 1.70113 2.40971 1.4577 2.55618 1.27281C2.55618 1.27281 3.87757 1.40223 6.00925 3.74412C6.00925 3.74412 5.60411 3.93826 5.06184 4.35117C5.06184 4.35117 5.05872 4.35425 5.05561 4.35425C4.46659 4.80106 3.7124 5.50979 3.13273 6.50509ZM8.07861 10.7852C8.05991 10.8222 7.96641 10.8622 7.86045 10.8777C7.75449 10.8931 7.43038 10.8838 7.2465 10.8622C6.58581 10.776 5.8846 10.5757 5.37349 10.3292C5.08678 10.1905 4.88108 10.0518 4.72838 9.90084L4.64112 9.81148L4.63177 9.69438C4.61618 9.49101 4.6193 9.17054 4.64423 9.05653C4.65982 8.961 4.6941 8.86856 4.74084 8.78536C4.76578 8.75454 4.76578 8.75454 4.87797 8.75454C5.0151 8.75454 5.1304 8.77611 5.31739 8.83466C5.70072 8.95176 6.27104 9.23525 6.96602 9.64816C7.53945 9.98712 7.75449 10.1535 7.91967 10.3815C8.03186 10.5233 8.10665 10.7236 8.07861 10.7852ZM15.4211 9.76526C15.4117 9.81456 15.2652 9.96247 15.1188 10.0703C14.6887 10.3815 13.9189 10.6712 13.1367 10.8099C12.691 10.89 12.2454 10.9023 12.1113 10.8376C12.0241 10.7945 12.0116 10.7606 12.0428 10.6496C12.1082 10.4185 12.3202 10.1658 12.6505 9.92857C12.8188 9.8084 13.5013 9.39856 13.8192 9.226C14.3428 8.94251 14.7666 8.77303 15.0533 8.73297C15.1437 8.72065 15.2528 8.71757 15.2871 8.73297C15.3432 8.75454 15.4055 8.91786 15.4304 9.11507C15.4429 9.21984 15.4366 9.68206 15.4211 9.76526ZM14.9037 4.35117L14.8975 4.34809C14.3739 3.93517 13.9812 3.74104 13.9812 3.74104C16.0412 1.39915 17.3159 1.26973 17.3159 1.26973C17.4561 1.4577 17.5465 1.69805 17.5964 1.97538C17.8862 3.62087 16.7612 6.50509 16.7612 6.50509C16.2906 5.67619 15.6579 4.9428 14.9037 4.35117Z" fill="#FFA409" />
                                                                        <path d="M17.5997 1.97518C17.3566 1.94437 16.2066 1.9382 14.9039 4.35097L14.8977 4.34789C14.3741 3.93498 13.9814 3.74084 13.9814 3.74084C16.0414 1.39895 17.3161 1.26953 17.3161 1.26953C17.4595 1.4575 17.5498 1.69785 17.5997 1.97518Z" fill="#FF9300" />
                                                                        <path d="M16.7644 6.50507C16.2907 5.67309 15.6611 4.94278 14.9038 4.35115C16.2065 1.93838 17.3534 1.94454 17.5996 1.97536C17.8894 3.62393 16.7644 6.50507 16.7644 6.50507Z" fill="#FF8300" />
                                                                        <path d="M17.6458 1.98434C17.6304 1.98126 17.615 1.97818 17.5996 1.9751L17.6458 1.98434Z" fill="#FF8300" />
                                                                        <path d="M6.00945 3.74084C6.00945 3.74084 5.60431 3.93498 5.06204 4.34789C5.06204 4.34789 5.05892 4.35097 5.0558 4.35097C3.70636 1.93512 2.51898 1.94437 2.26343 1.97518C2.31329 1.69785 2.40679 1.45442 2.55326 1.26953C2.55638 1.26953 3.87777 1.39895 6.00945 3.74084Z" fill="#FF9300" />
                                                                        <path d="M5.05877 4.35115C4.46664 4.80104 3.71245 5.50669 3.13278 6.50507C3.13278 6.50507 1.96721 3.62393 2.2664 1.97536C2.51883 1.94454 3.70933 1.93838 5.05877 4.35115Z" fill="#FF8300" />
                                                                        <path d="M2.26585 1.9751C2.25045 1.97818 2.23196 1.98126 2.21655 1.98434L2.26585 1.9751Z" fill="#FF8300" />
                                                                        <path d="M13.6105 8.10431C13.6105 8.10431 12.6132 8.16594 12.7378 7.39558C12.8625 6.62522 13.6416 6.53277 13.8598 6.56359C14.0779 6.5944 14.9505 6.90255 14.7947 7.54965C14.6389 8.19675 14.4207 8.07349 14.2961 8.10431C14.1714 8.13512 13.6105 8.10431 13.6105 8.10431Z" fill="white" />
                                                                        <path d="M6.25572 8.10431C6.25572 8.10431 5.25844 8.16594 5.3831 7.39558C5.50776 6.62522 6.28688 6.53277 6.50504 6.56359C6.72319 6.5944 7.59581 6.90255 7.43998 7.54965C7.28416 8.19675 7.066 8.07349 6.94134 8.10431C6.81668 8.13512 6.25572 8.10431 6.25572 8.10431Z" fill="white" />
                                                                    </svg> SHIB</Dropdown.Item>
                                                                    <Dropdown.Item href="#/action-3"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                                        <path d="M10 0C15.5234 0 20 4.47754 20 10C20 15.5234 15.5234 20 10 20C4.47754 20 0 15.5229 0 10C0 4.47754 4.47754 0 10 0Z" fill="#F5AC37" />
                                                                        <path d="M10.3687 10.7061H14.1685C14.2495 10.7061 14.2877 10.7061 14.2936 10.5999C14.3246 10.2134 14.3246 9.82458 14.2936 9.43758C14.2936 9.36243 14.2562 9.33138 14.1748 9.33138H6.61247C6.51887 9.33138 6.49367 9.36243 6.49367 9.45018V10.5626C6.49367 10.7061 6.49367 10.7061 6.64352 10.7061H10.3687ZM13.8692 8.03131C13.88 8.00296 13.88 7.97191 13.8692 7.94401C13.8058 7.80586 13.7306 7.67401 13.6433 7.55026C13.5119 7.33876 13.3571 7.1439 13.1807 6.96885C13.0975 6.8631 13.0012 6.76815 12.8932 6.6876C12.3523 6.22724 11.7092 5.90144 11.018 5.73764C10.6693 5.65934 10.3129 5.62199 9.95556 5.62514H6.59942C6.50582 5.62514 6.49322 5.66249 6.49322 5.74394V7.96246C6.49322 8.05606 6.49322 8.08126 6.61202 8.08126H13.8242C13.8242 8.08126 13.8868 8.06866 13.8994 8.03131H13.8688H13.8692ZM13.8692 12.0062C13.763 11.9945 13.6559 11.9945 13.5497 12.0062H6.61877C6.52517 12.0062 6.49367 12.0062 6.49367 12.1313V14.3003C6.49367 14.4002 6.49367 14.4254 6.61877 14.4254H9.81875C9.97176 14.4371 10.1248 14.4263 10.2746 14.3944C10.739 14.3611 11.1958 14.2603 11.6314 14.0942C11.7898 14.0393 11.9428 13.9678 12.0872 13.8818H12.1309C12.881 13.4917 13.4903 12.8788 13.8746 12.1264C13.8746 12.1264 13.9183 12.0319 13.8692 12.0071V12.0062ZM5.23771 15.55V15.5126V14.0564V13.5628V12.094C5.23771 12.0125 5.23771 12.0004 5.13781 12.0004H3.78149C3.70634 12.0004 3.67529 12.0004 3.67529 11.9005V10.7129H5.12521C5.20621 10.7129 5.23771 10.7129 5.23771 10.6067V9.43173C5.23771 9.35658 5.23771 9.33813 5.13781 9.33813H3.78149C3.70634 9.33813 3.67529 9.33813 3.67529 9.23822V8.13841C3.67529 8.06956 3.67529 8.05111 3.77519 8.05111H5.11891C5.21251 8.05111 5.23771 8.05111 5.23771 7.93231V4.56358C5.23771 4.46368 5.23771 4.43848 5.36281 4.43848H10.0501C10.3903 4.45198 10.7282 4.48933 11.0626 4.55098C11.7515 4.67833 12.4135 4.92448 13.0187 5.27593C13.4201 5.51219 13.7896 5.79749 14.1185 6.12599C14.366 6.38295 14.5893 6.66105 14.7873 6.95715C14.9839 7.25731 15.1473 7.57816 15.2755 7.91341C15.2913 8.00071 15.375 8.05966 15.4623 8.04481H16.581C16.7245 8.04481 16.7245 8.04481 16.7308 8.18251V9.20762C16.7308 9.30753 16.6935 9.33273 16.5931 9.33273H15.7305C15.6432 9.33273 15.618 9.33273 15.6243 9.44523C15.6585 9.82593 15.6585 10.208 15.6243 10.5887C15.6243 10.6949 15.6243 10.7075 15.7435 10.7075H16.7304C16.774 10.7637 16.7304 10.82 16.7304 10.8767C16.7367 10.9491 16.7367 11.0225 16.7304 11.0949V11.8514C16.7304 11.9576 16.6993 11.9891 16.6053 11.9891H15.424C15.3417 11.9734 15.2616 12.026 15.2427 12.1079C14.9614 12.8392 14.5114 13.4948 13.93 14.0204C13.7176 14.2117 13.4944 14.3917 13.2613 14.5577C13.0111 14.7017 12.7676 14.8516 12.5111 14.9704C12.0391 15.1828 11.5441 15.3394 11.036 15.4388C10.5536 15.5252 10.0645 15.5644 9.5735 15.5576H5.23591V15.5513L5.23771 15.55Z" fill="#FEFEFD" />
                                                                    </svg> DAI</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                        <div className='swap_outer d-none'>
                                                            <button onClick={handleShow} className='swap__button '><svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
                                                                <path d="M3.78701 0.399902L0.700439 3.63035V5.72561L7.50196 12.2999L14.3004 5.72914V4.88304H5.99605L6.57155 6.62988H10.4354L7.50135 9.46724L2.8408 4.9606L5.20724 2.48694H9.79547L10.8067 3.54515H13.9188V3.23139L11.2133 0.399902H3.78701Z" fill="#329879" />
                                                            </svg>Gems<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                                    <path d="M1 1.5L4 4.5L7 1.5" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg></button>
                                                        </div>

                                                    </div>
                                                    <div className='swap_inner'>
                                                        <div>
                                                            <p>From</p>
                                                            <h2>0.00</h2>
                                                        </div>
                                                        <div className='swap_textt'>
                                                            <img src='\asset\dropimg.svg' />
                                                            <h5>KEVAI</h5>
                                                        </div>
                                                    </div>
                                                    <button>Swap</button>
                                                    <div className='swap_lower'>
                                                        <h6>Powered by</h6>
                                                        <a href='https://gems.vip/' target='blank'>
                                                            <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                <path d="M3.3792 2.3999L1.20044 4.68022V6.15923L6.00151 10.7999L10.8004 6.16172V5.56447H4.93851L5.34475 6.79753H8.07217L6.00108 8.80038L2.71128 5.61922L4.38171 3.87311H7.62046L8.33427 4.62008H10.531V4.3986L8.62125 2.3999H3.3792Z" fill="#329879" />
                                                            </svg> Gems </h4></a>
                                                    </div>
                                                </div>
                                                <div className='inner_right'>
                                                    <h1>Mining Progress <span>{!!uniSwapPoolAddreess ? 100 : percentage}%</span></h1>
                                                    <ProgressBar now={!!uniSwapPoolAddreess ? 100 : percentage} />
                                                    {!!uniSwapPoolAddreess &&
                                                        <a href={uniSwapPoolContractAddress || ''}
                                                            target="_blank"
                                                            rel="noreferrer">
                                                            <div className='trade_div' style={{ display: 'flex', marginBottom: '10px' }}>
                                                                <h2>Trade on</h2>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="14" viewBox="0 0 62 14" fill="none">
                                                                    <path d="M6.05632 6.54081C6.32646 7.01726 5.71864 7.15338 5.4485 7.18741C5.04329 7.22145 4.94199 6.98322 5.00953 6.67694C5.04329 6.57484 5.11083 6.47275 5.17836 6.40468C5.2459 6.33662 5.38097 6.26855 5.48227 6.26855C5.58357 6.26855 5.71864 6.26855 5.78618 6.33662C5.92125 6.37065 5.98878 6.43871 6.05632 6.54081Z" fill="#EB1A6B" />
                                                                    <path d="M7.67716 5.68994C7.37325 8.07217 11.4929 7.56169 11.4254 9.43345C11.8306 8.88894 11.9994 7.4596 10.8175 6.7109C9.73698 6.03026 8.35251 6.40461 7.67716 5.68994Z" fill="#EB1A6B" />
                                                                    <path d="M10.0753 4.77119C10.0416 4.73716 10.0078 4.73716 10.0078 4.70312C10.0078 4.73716 10.0416 4.77119 10.0753 4.77119Z" fill="#EB1A6B" />
                                                                    <path d="M11.0199 6.50671C10.9861 6.43865 10.9524 6.37058 10.8848 6.30252C10.7498 6.09833 10.5472 5.9622 10.3108 5.92817C10.1757 5.89414 10.0069 5.8601 9.83804 5.8601C9.6692 5.8601 9.53413 5.82607 9.3653 5.82607C9.02762 5.79204 8.72371 5.75801 8.38604 5.68995C8.3185 5.65591 8.2172 5.65591 8.14967 5.62188C8.1159 5.62188 8.08213 5.58785 8.0146 5.58785C7.98083 5.55382 7.94706 5.55382 7.87953 5.51979C7.71069 5.45172 7.57562 5.3156 7.47432 5.2135C7.23794 4.97528 7.03534 4.70302 6.83273 4.4648C6.63013 4.19254 6.46129 3.95432 6.22492 3.7161C6.02231 3.47788 5.75217 3.27368 5.48203 3.13756C5.2119 3.00143 4.87422 2.89933 4.57031 2.8653C4.90799 2.83127 5.24566 2.8653 5.54957 3.00143C5.85348 3.13756 6.15738 3.30772 6.39376 3.54594C6.56259 3.68207 6.69766 3.85223 6.83273 4.02239C7.87953 3.81819 8.68995 3.98835 9.33153 4.3627C9.53413 4.4648 9.73674 4.60093 9.90558 4.77109C9.93934 4.80512 9.97311 4.80512 9.97311 4.83915C10.1082 4.97528 10.2433 5.1114 10.3446 5.24753C10.8173 5.68995 11.0199 6.20042 11.0199 6.50671Z" fill="#EB1A6B" />
                                                                    <path d="M4.67244 3.1377C4.94258 3.17173 5.21272 3.27382 5.38156 3.47801C5.55039 3.6822 5.61793 3.95446 5.68546 4.19268C5.71923 4.39687 5.753 4.60106 5.82053 4.77122C5.8543 4.87332 5.92184 4.94138 5.9556 5.00945C5.98937 5.07751 6.05691 5.14558 6.09067 5.21364V5.24767V5.2817C5.98937 5.3838 5.753 5.2817 5.6517 5.21364C5.48286 5.14558 5.34779 5.00945 5.21272 4.87332C4.84128 4.46494 4.63867 3.85236 4.63867 3.30785C4.63867 3.27382 4.67244 3.20576 4.67244 3.1377Z" fill="#EB1A6B" />
                                                                    <path d="M9.0613 7.90234C8.48725 9.50184 11.0873 10.5909 10.1081 12.2244C11.0873 11.816 11.5601 10.5568 11.1549 9.5699C10.8172 8.68508 9.73665 8.34476 9.0613 7.90234Z" fill="#EB1A6B" />
                                                                    <path d="M5.65137 9.97764C5.8202 9.87554 5.98904 9.77345 6.15788 9.67135C6.32672 9.60329 6.52932 9.53522 6.73193 9.50119C7.10337 9.43313 7.50858 9.3991 7.81249 9.26297C7.98132 9.19491 8.11639 9.12684 8.25146 8.99071C8.38653 8.88862 8.45407 8.75249 8.5216 8.58233C8.58914 8.41217 8.58914 8.24201 8.58914 8.07185C8.58914 7.86766 8.5216 7.6975 8.45407 7.52734C8.58914 7.66347 8.69044 7.86766 8.75798 8.07185C8.82551 8.27604 8.82551 8.48023 8.79174 8.68443C8.75798 8.88862 8.62291 9.09281 8.48784 9.26297C8.35277 9.3991 8.15016 9.53522 7.94756 9.60329C7.74495 9.67135 7.54235 9.70538 7.33974 9.73941C7.13714 9.73941 6.9683 9.77345 6.76569 9.77345C6.39425 9.77345 6.02281 9.84151 5.65137 9.97764Z" fill="#EB1A6B" />
                                                                    <path d="M9.29857 12.8027C9.23103 12.8367 9.19726 12.9048 9.12973 12.9388C9.06219 12.9728 8.99466 13.0069 8.92712 13.0409C8.79205 13.109 8.62322 13.143 8.45438 13.143C8.0154 13.143 7.71149 12.8027 7.54266 12.4283C7.40759 12.1901 7.34005 11.9179 7.20498 11.6796C7.00238 11.3393 6.63093 11.0671 6.22572 11.1011C6.05689 11.1351 5.88805 11.2032 5.82051 11.3393C5.58414 11.7137 5.92182 12.2582 6.39456 12.1901C6.42833 12.1901 6.4621 12.1901 6.49586 12.1561C6.52963 12.1561 6.5634 12.122 6.59717 12.088C6.6647 12.0199 6.69847 11.9519 6.73224 11.8838C6.766 11.8158 6.766 11.7137 6.766 11.6116C6.73224 11.5095 6.69847 11.4414 6.63093 11.4074C6.73224 11.4414 6.79977 11.5095 6.83354 11.6116C6.79977 11.7817 6.79977 11.8838 6.79977 11.9859C6.766 12.088 6.73224 12.1901 6.6647 12.2582C6.63093 12.2922 6.59717 12.3262 6.52963 12.3603C6.49586 12.3943 6.42833 12.4283 6.39456 12.4283C6.29326 12.4624 6.19196 12.4624 6.09065 12.4624C5.95558 12.4283 5.78675 12.3943 5.68544 12.2922C5.55037 12.1901 5.44907 12.0199 5.314 11.9179C5.17893 11.7477 5.01009 11.6456 4.80749 11.5435C4.67242 11.4754 4.53735 11.4414 4.40228 11.4074C4.33474 11.4074 4.26721 11.3733 4.19967 11.3733C4.16591 11.3733 3.99707 11.3393 3.99707 11.3393C4.23344 11.1351 4.46981 10.965 4.70619 10.7948C4.97633 10.6246 5.24647 10.5225 5.55037 10.4204C5.85428 10.3184 6.15819 10.3184 6.49586 10.3524C6.6647 10.3864 6.79977 10.4204 6.96861 10.4885C7.13745 10.5566 7.27252 10.6587 7.40759 10.7608C7.54266 10.8969 7.64396 11.033 7.71149 11.1692C7.77903 11.3053 7.8128 11.4754 7.84656 11.6456C7.94787 12.122 7.9141 12.8707 8.52191 12.9728C8.55568 12.9728 8.58945 12.9728 8.62322 12.9728H8.72452C8.79205 12.9728 8.85959 12.9728 8.92712 12.9388C9.02843 12.9388 9.1635 12.8707 9.29857 12.8027Z" fill="#EB1A6B" />
                                                                    <path d="M5.14461 5.55366C5.11084 5.65575 5.07708 5.72381 5.04331 5.79188C4.94201 5.92801 4.80694 6.0301 4.67187 6.09817C4.5368 6.16623 4.40173 6.20026 4.23289 6.20026C4.19912 6.20026 4.16535 6.20026 4.13159 6.20026C4.03028 6.20026 3.96275 6.23429 3.86145 6.30236C3.79391 6.37042 3.72638 6.43848 3.72638 6.54058C3.72638 6.57461 3.69261 6.64268 3.69261 6.67671C3.69261 6.81284 3.65884 6.91493 3.65884 7.08509C3.62508 7.35735 3.55754 7.59557 3.45624 7.83379C3.32117 8.14008 3.15233 8.41233 3.1861 8.75265C3.21986 8.99087 3.32117 9.16103 3.49001 9.29716C3.76015 9.60345 4.40173 9.73958 4.26666 10.4542C4.16535 10.8967 3.45624 11.3391 2.47698 11.5092C2.57828 11.5092 2.34191 11.1008 2.34191 11.0668C2.24061 10.8967 2.10554 10.7265 2.038 10.5563C1.86917 10.216 1.80163 9.77361 1.86917 9.39925C1.9367 8.99087 2.24061 8.68459 2.47698 8.34427C2.78089 7.96992 3.0848 7.49347 3.15233 6.98299C3.15233 6.8809 3.1861 6.71074 3.21987 6.57461C3.25363 6.40445 3.2874 6.26833 3.35493 6.09817C3.3887 5.99607 3.45624 5.92801 3.55754 5.82591C3.59131 5.79188 3.62508 5.72382 3.62508 5.68978C3.62508 5.62172 3.62508 5.58769 3.59131 5.51962L2.00424 2.62692L4.30042 5.48559C4.33419 5.51962 4.36796 5.55366 4.40173 5.55366C4.43549 5.58769 4.46926 5.58769 4.5368 5.58769C4.57056 5.58769 4.60433 5.58769 4.67187 5.55366C4.70563 5.51962 4.7394 5.51962 4.77317 5.48559C4.80694 5.45156 4.80694 5.41753 4.80694 5.34946C4.80694 5.31543 4.80694 5.24737 4.77317 5.21334C4.6381 5.00915 4.46926 4.83899 4.30042 4.6348L3.72638 3.92013L2.57828 2.49079L0.991211 0.48291L2.71335 2.35466L3.92898 3.71594L4.5368 4.39657C4.7394 4.6348 4.94201 4.83899 5.14461 5.11124L5.17838 5.14527V5.21334C5.17838 5.34947 5.17838 5.45156 5.14461 5.55366Z" fill="#EB1A6B" />
                                                                    <path d="M5.68477 12.2579C5.58346 12.1559 5.48216 12.0538 5.38086 11.9517C5.48216 12.0878 5.5497 12.1899 5.68477 12.2579Z" fill="#EB1A6B" />
                                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M35.434 4.56653C34.3197 4.83878 33.8132 5.72361 34.1171 6.7786C34.2521 7.22101 34.6573 7.69746 35.2652 8.03778C36.312 8.65035 36.6496 8.88857 36.8185 9.26292C36.9535 9.56921 36.9873 9.67131 36.9198 9.97759C36.7509 10.6582 36.2782 10.9985 35.6028 10.9985C34.9275 10.9985 34.4547 10.6242 34.3197 9.97759C34.2859 9.70534 34.2184 9.63727 34.1171 9.63727C33.982 9.63727 33.9482 9.70534 33.9482 10.3519V11.0666L34.3872 11.2027C35.0963 11.441 36.0756 11.4069 36.6496 11.1347C37.7977 10.5902 38.2367 9.53518 37.7302 8.54825C37.5276 8.1739 37.0548 7.76552 36.2444 7.25504C35.3665 6.71054 34.995 6.33618 34.9275 5.96183C34.8262 5.34926 35.3665 4.87282 36.1094 4.87282C36.6834 4.87282 36.9198 5.00894 37.1224 5.45136C37.2574 5.72361 37.325 5.82571 37.4938 5.82571C37.6627 5.82571 37.6964 5.79167 37.6289 5.62151C37.5951 5.51942 37.5614 5.24717 37.5614 5.04297C37.5614 4.77072 37.5276 4.63459 37.4263 4.60056C37.1899 4.49846 35.7379 4.46443 35.434 4.56653ZM13.1475 4.80475C13.1475 4.94088 13.215 4.97491 13.3501 4.97491C13.7553 4.97491 13.789 5.07701 13.8228 7.56133C13.8566 9.70534 13.8903 9.8755 14.0592 10.2158C14.2956 10.6582 14.6332 10.9645 15.1397 11.2027C15.4774 11.3729 15.7138 11.4069 16.4229 11.4069C17.1658 11.4069 17.3346 11.3729 17.7398 11.1687C18.01 11.0326 18.3477 10.7944 18.4827 10.6242C18.9555 10.0457 19.023 9.73937 19.0568 7.35714C19.1243 5.04297 19.1243 5.00894 19.4957 5.00894C19.5971 5.00894 19.6308 4.94088 19.6308 4.83878C19.6308 4.66862 19.5633 4.66862 18.6178 4.66862C17.6723 4.66862 17.6048 4.66862 17.6048 4.83878C17.6048 4.97491 17.6723 5.00894 17.8749 5.04297C18.3139 5.07701 18.3477 5.24717 18.3477 7.35714C18.3477 9.50115 18.2801 9.90953 17.8074 10.3519C17.4022 10.7603 17.0645 10.8965 16.4904 10.8965C15.68 10.8965 15.0722 10.5221 14.9034 9.84146C14.8358 9.60324 14.8021 8.78648 14.8358 7.32311L14.8696 5.14507L15.1735 5.04297C15.3423 4.97491 15.4774 4.87281 15.5112 4.80475C15.545 4.66862 15.4099 4.66862 14.3631 4.66862C13.215 4.63459 13.1475 4.63459 13.1475 4.80475ZM21.0153 4.80475C21.0153 4.94088 21.0828 4.97491 21.2517 4.97491C21.6906 4.97491 21.927 5.14507 22.0283 5.51942C22.0958 5.72361 22.0958 6.71054 22.0958 8.10584C22.0621 10.6242 22.0283 10.7944 21.5218 10.8965C21.353 10.9305 21.2854 10.9985 21.2854 11.1006C21.2854 11.2368 21.353 11.2708 22.4673 11.2708C23.5478 11.2708 23.6491 11.2708 23.6491 11.1347C23.6491 11.0326 23.5478 10.9645 23.2777 10.8965C22.94 10.7944 22.9063 10.7603 22.805 10.4881C22.6699 10.0797 22.6699 6.23409 22.7712 6.26812C22.805 6.26812 23.1426 6.60844 23.5141 7.05085C23.8855 7.49327 24.8648 8.61632 25.7427 9.53518C27.0934 10.9985 27.3298 11.2708 27.5324 11.2708H27.7688L27.8025 8.276C27.8363 6.13199 27.8701 5.24716 27.9376 5.1791C28.0052 5.11104 28.174 5.04297 28.3091 5.00894C28.4779 4.97491 28.5792 4.90685 28.5792 4.83878C28.5792 4.73669 28.3766 4.70266 27.4311 4.70266C26.3168 4.66862 26.283 4.66862 26.283 4.83878C26.283 4.97491 26.3505 5.00894 26.4856 5.00894C26.5869 5.00894 26.7895 5.11104 26.9246 5.21313L27.161 5.41732L27.1947 7.45924C27.1947 8.61632 27.1947 9.50115 27.161 9.50115C27.1272 9.50115 26.8571 9.22889 26.5869 8.92261C26.3168 8.61632 25.5401 7.73149 24.8648 6.98279C24.1894 6.23409 23.4465 5.41732 23.2102 5.14507L22.805 4.66862H21.927C21.0491 4.63459 21.0153 4.63459 21.0153 4.80475ZM29.8624 4.80475C29.8624 4.94088 29.9299 4.97491 30.0987 4.97491C30.2338 4.97491 30.4026 5.04297 30.5039 5.11104C30.6728 5.21313 30.6728 5.38329 30.7066 7.73149C30.7403 10.6582 30.7066 10.8284 30.2 10.8965C29.9637 10.9305 29.8624 10.9985 29.8624 11.1006C29.8624 11.2368 29.9637 11.2708 31.1455 11.2708C32.3612 11.2708 32.4287 11.2708 32.4287 11.1006C32.4287 10.9645 32.3612 10.9305 32.2261 10.9305C32.1248 10.9305 31.9559 10.8624 31.8546 10.7944C31.6858 10.6923 31.6858 10.5221 31.652 8.00374C31.6183 5.41732 31.6183 5.31523 31.7871 5.14507C31.8884 5.04297 32.0573 4.97491 32.1586 4.97491C32.3274 4.97491 32.3612 4.94088 32.3612 4.80475C32.3612 4.63459 32.2936 4.63459 31.078 4.63459C29.9299 4.63459 29.8624 4.63459 29.8624 4.80475ZM38.7432 4.80475C38.777 4.90685 38.8445 4.97491 38.9796 4.97491C39.0809 4.97491 39.2497 5.07701 39.351 5.1791C39.4523 5.2812 40.0264 6.6765 40.668 8.34406L41.7823 11.3048L42.0862 11.3389L42.3901 11.3729L43.1668 9.26292C43.6057 8.10584 44.0109 7.05085 44.0447 6.94876C44.146 6.74457 44.146 6.7786 44.4161 7.45924C44.5512 7.86762 44.9564 8.88857 45.2941 9.7734L45.9019 11.3729H46.1721C46.3071 11.3729 46.4422 11.3389 46.476 11.2708C46.5097 11.2027 46.8812 10.2158 47.3539 9.05873C47.7929 7.90165 48.2994 6.60844 48.4682 6.20006C48.8397 5.24716 48.9072 5.14507 49.1774 5.04297C49.3124 5.00894 49.4137 4.90685 49.4137 4.83878C49.4137 4.73669 49.2449 4.70266 48.4007 4.70266C47.4552 4.70266 47.3877 4.70266 47.3877 4.87282C47.3877 5.00894 47.4552 5.04297 47.5903 5.04297C47.928 5.04297 48.063 5.14507 48.063 5.34926C48.063 5.51942 46.4422 9.90953 46.3409 10.0116C46.2734 10.0797 44.8214 5.99587 44.7876 5.58748C44.7201 5.21313 44.8889 5.04297 45.2603 5.04297C45.3954 5.04297 45.4629 5.00894 45.4629 4.87282C45.4629 4.70266 45.3954 4.70266 44.146 4.70266C42.8966 4.70266 42.8291 4.70266 42.8291 4.87282C42.8291 4.97491 42.8966 5.04297 42.9642 5.04297C43.2343 5.04297 43.572 5.31523 43.6733 5.55345C43.8083 5.9278 43.707 6.30215 42.9304 8.34406L42.2888 10.0797L42.1537 9.73937C42.0862 9.56921 41.681 8.48019 41.2758 7.35714C40.4654 5.14507 40.4654 5.04297 41.0056 5.04297C41.2082 5.04297 41.242 5.00894 41.242 4.87282C41.242 4.70266 41.1745 4.70266 39.9926 4.70266C38.7094 4.63459 38.6757 4.63459 38.7432 4.80475ZM55.8296 4.87282C55.8296 4.87282 55.8296 4.97491 55.8296 5.00894C55.8296 5.04297 55.9309 5.04297 55.9309 5.04297C55.9984 5.04297 56.0322 5.07701 56.0997 5.07701C56.3698 5.14507 56.5387 5.1791 56.6062 5.34926C56.64 5.45136 56.6737 5.85974 56.6737 8.00374C56.6737 10.2498 56.6737 10.5221 56.6062 10.6582C56.5387 10.8284 56.4036 10.9305 56.0659 11.0326C56.0659 11.0326 55.9309 11.0666 55.8971 11.1006C55.8633 11.1347 55.8633 11.2027 55.8633 11.2027C55.8633 11.2027 55.8633 11.2708 55.8971 11.3048C55.9309 11.3389 56.0322 11.3389 56.0322 11.3389H56.8764H58.2946C58.2946 11.3389 58.3621 11.3389 58.3959 11.3048C58.4297 11.2708 58.4297 11.2027 58.4297 11.2027C58.4297 11.2027 58.4297 11.1347 58.3959 11.1006C58.3621 11.0666 58.2271 11.0326 58.2271 11.0326C57.9231 10.9645 57.7543 10.8624 57.6868 10.6923C57.6192 10.5561 57.6192 10.2498 57.6192 9.53518V8.51422C57.653 8.54825 57.6868 8.54826 57.7205 8.58229C57.8894 8.68438 58.092 8.85454 58.8349 8.85454C59.7466 8.88857 60.2869 8.48019 60.6245 8.00374C60.9622 7.5273 61.0635 6.7786 60.8271 5.96183C60.5908 5.1791 59.8817 4.66862 58.9024 4.63459C58.3959 4.60056 57.6192 4.63459 57.214 4.66862H57.1127C56.7413 4.66862 56.2685 4.73669 56.0322 4.73669C55.9646 4.73669 55.9646 4.73669 55.9309 4.77072C55.8296 4.83878 55.8296 4.87282 55.8296 4.87282ZM59.5778 8.00374C59.9492 7.66343 59.9492 7.11892 59.9492 6.74457C59.9154 6.20006 59.6791 5.14507 58.4634 5.14507C58.1595 5.14507 57.5855 5.1791 57.5517 5.58748C57.5179 5.65555 57.5179 6.16603 57.5179 6.91473V8.13987L57.653 8.20794C57.7205 8.24197 57.8218 8.276 57.9569 8.31003C58.4634 8.44616 59.2063 8.34406 59.5778 8.00374ZM51.8112 4.73669C51.9125 4.70266 51.9801 4.66862 51.9801 4.66862C51.9801 4.66862 52.1151 4.60056 52.1489 4.66862C52.1489 4.70266 52.2164 4.80475 52.3515 5.14507C52.3853 5.21313 52.419 5.2812 52.419 5.34926C52.5879 5.82571 52.858 6.50634 52.9931 6.88069C53.1282 7.25504 53.3983 7.93568 53.6009 8.48019C53.8035 8.99067 54.0399 9.63727 54.175 9.94356C54.2763 10.2498 54.4451 10.5221 54.4789 10.5902C54.5126 10.6242 54.5126 10.6582 54.5464 10.6923C54.6477 10.8284 54.749 11.0326 54.9854 11.0666C54.9854 11.0666 55.1542 11.1006 55.188 11.1347C55.2217 11.1687 55.2217 11.2027 55.2217 11.2027V11.3048C55.2217 11.3048 55.2217 11.3389 55.188 11.3389C55.188 11.3729 55.1204 11.3389 55.1204 11.3389H53.7022H52.6892C52.6892 11.3389 52.6554 11.3389 52.6217 11.3389C52.5879 11.3389 52.5879 11.2708 52.5879 11.2708V11.2027C52.5879 11.2027 52.5879 11.1347 52.6217 11.1006C52.6554 11.0666 52.8243 11.0326 52.8243 11.0326C53.1282 10.9985 53.2632 10.7603 53.297 10.6242V10.5902C53.3645 10.454 53.3308 10.3519 53.0269 9.63727C52.8243 9.16083 52.7567 9.0247 52.723 8.99067C52.6892 8.99067 52.1489 8.99067 51.5749 8.99067H50.4605L50.393 9.16083C50.1904 9.70534 50.0216 10.2158 50.0216 10.3519C49.954 10.6242 50.0553 10.9645 50.4605 11.0326C50.4605 11.0326 50.6294 11.0666 50.6631 11.1006C50.6969 11.1347 50.7307 11.2027 50.7307 11.2027V11.2708C50.7307 11.2708 50.7307 11.3048 50.6969 11.3389C50.6631 11.3729 50.5956 11.3389 50.5956 11.3389H49.5488H48.5358C48.5358 11.3389 48.502 11.3389 48.4682 11.3048C48.4345 11.2708 48.4345 11.2368 48.4345 11.2368V11.1687C48.4345 11.1687 48.4345 11.1347 48.502 11.0666C48.5696 10.9985 48.7046 10.9985 48.7046 10.9985C48.9748 10.9645 49.1436 10.6582 49.2449 10.4881C49.2449 10.4881 49.2449 10.454 49.2787 10.454C49.3124 10.386 49.4813 10.0116 49.6501 9.60324C49.8189 9.19486 49.9878 8.71841 50.0553 8.58229C50.2579 8.07181 50.4605 7.59536 50.7644 6.84666C50.9333 6.43828 51.1697 5.82571 51.3047 5.48539L51.5411 4.87282L51.8112 4.73669ZM51.7437 6.20006C51.8112 6.33618 51.8788 6.54037 51.9125 6.64247C51.9463 6.74457 52.0814 7.05085 52.1827 7.32311C52.284 7.59536 52.419 7.90165 52.4866 8.03778C52.5541 8.1739 52.5879 8.276 52.5879 8.276C52.5879 8.276 52.1827 8.276 51.6762 8.276C51.1021 8.276 50.7644 8.276 50.7644 8.24197C50.7644 8.24197 50.7982 8.1739 50.7982 8.10584C50.832 8.00375 51.0346 7.45923 51.4398 6.30215C51.5073 6.13199 51.5749 5.96183 51.5749 5.9278C51.6086 5.9278 51.6424 5.96183 51.7437 6.20006Z" fill="#02171D" />
                                                                </svg>

                                                                <svg className='sharebutton' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                    <path d="M12.25 7.58333V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V2.91667C1.75 2.60725 1.87292 2.3105 2.09171 2.09171C2.3105 1.87292 2.60725 1.75 2.91667 1.75H6.41667" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M12.25 1.75L7 7" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M8.75 1.75H12.25V5.25" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg>
                                                            </div>
                                                        </a>
                                                    }
                                                    <h5 className='youget_text'>Remaining ETH<span className='dashesnew'> {remainingGems && percentage < 100 ? (3 - parseFloat(remainingGems))?.toFixed(6) : "--"}</span></h5>

                                                </div>
                                                <div className='inner_right'>
                                                    <h1>King of the Desert progress: <span>{kingOfDesertPercentage}%</span></h1>
                                                    <ProgressBar now={kingOfDesertPercentage} className='desertprogress' />
                                                    {!detail?.kingOfDessertStatus ? <p>Dethrone the current king at 1.5 ETH.</p> : ""}
                                                </div>
                                                <div className='holders_div'>
                                                    <div className='topholders'>
                                                        <h1>Top Holders</h1>
                                                    </div>
                                                    {
                                                        topHolder && topHolder?.length > 0 ? (
                                                            topHolder?.map((item, index) => {
                                                                return (
                                                                    <>
                                                                        <div className='holder_bottom'>
                                                                            <h3>{index + 1}.</h3>
                                                                            {/* <h4>{item?.address?.slice(0, 6)}{item?.address?.toLowerCase() === detail?.creatorAddress?.toLowerCase() && " 🤵‍♂️ (dev)"}{item?.address?.toLowerCase() === bondingCurveWallet?.toLowerCase() && " 🏦 (bonding curve)"}<span>{item?.percentage}</span></h4> */}
                                                                        </div>
                                                                    </>
                                                                )
                                                            })
                                                        )
                                                            :
                                                            <p>No Data Found!</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {detail?.projectDescription || checkLinks ?
                                            <div className="tab-pane fade" id="v-pills-Info" role="tabpanel" aria-labelledby="v-pills-Info-tab">
                                                <div className='midddle_left'>
                                                    {checkLinks ?
                                                        <div className='new_links'>
                                                            <h1>
                                                                Social Links
                                                            </h1>

                                                            <div className='imgdiv'>
                                                                {detail?.twitter &&
                                                                    <a href={detail?.twitter} target="_blank" rel="noopener noreferrer">
                                                                        <img className="websiteslogo" src='\asset\xnew.svg' /></a>}
                                                                {detail?.telegram &&
                                                                    <a href={detail?.telegram} target="_blank" rel="noopener noreferrer">
                                                                        <img className="websiteslogo" src='\asset\telenew.svg' /></a>}
                                                                {detail?.discord &&
                                                                    <a href={detail?.discord} target="_blank" rel="noopener noreferrer">
                                                                        <img className="websiteslogo" src='\asset\twe.svg' /></a>}
                                                                {detail?.youtube &&
                                                                    <a href={detail?.youtube} target="_blank" rel="noopener noreferrer">
                                                                        <img className="websiteslogo" src='\asset\youtube.svg' /></a>}
                                                                {detail?.website &&
                                                                    <a href={detail?.website} target="_blank" rel="noopener noreferrer">
                                                                        <img className="websiteslogo" src='\asset\stroke.svg' /></a>}
                                                            </div>
                                                        </div>
                                                        : ""}
                                                    {detail?.projectDescription ? <>
                                                        <h2>Description</h2>
                                                        <p>{detail?.projectDescription}</p></> : ""}
                                                </div>
                                            </div> : ""}
                                        <div className="tab-pane fade" id="v-pills-Thread" role="tabpanel" aria-labelledby="v-pills-Thread-tab">
                                            <div className='bottom_left'>
                                                <h1>Forum Chat</h1>
                                                <textarea id="w3review" name="w3review" maxLength={300} rows={4} cols={50} placeholder='Type your comment' value={postComment} onChange={(e) => setPostComment(e.target.value)} />
                                                <div className='textarea_div'>
                                                    <p>{postComment?.length}/300 Characters</p>
                                                    <button disabled={commentDisable}> {commentDisable ? <Spinner size="sm" /> :
                                                        "Post"}</button>
                                                </div>
                                                {/* {
                                                    listComment && listComment?.length > 0 ? (
                                                        listComment?.map((item, index) => {
                                                            // const userLike = item?.likes?.find(like => like.userId === userId);
                                                            // const isLiked = userLike ? userLike.isLiked : false;
                                                            // const likeCount = item?.likes?.filter(like => like.isLiked).length;
                                                            return ( */}
                                                <>
                                                    <div>
                                                        <div className='top_sidebarr new_area'>
                                                            <div className='bottom_area '>
                                                                <div className='smallimg_div'>
                                                                    {/* <img src={item?.userId?.pfp} /> */}
                                                                    {/* <h3>{item?.walletAddress?.slice(0, 5)}...{item?.walletAddress?.slice(-3)}</h3> */}
                                                                </div>
                                                                {/* <p>{moment(item.createdAt).format('DD/MM/YYYY h:mm A')}</p> */}
                                                                {/* <h4><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                                    <path d="M4.5 8.5L2 6L4.5 3.5" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                                    <path d="M10 9V8C10 7.46957 9.78929 6.96086 9.41421 6.58579C9.03914 6.21071 8.53043 6 8 6H2" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                                </svg>Reply</h4> */}
                                                                {/* <img className='thumbbb' src='\asset\thumb.svg' /> */}
                                                                {/* {likeCount > 0 && <p>{likeCount}</p>} */}
                                                                {/* <LikeButton itemId={item?._id} isLiked={isLiked} setLikeData={setLikeData} /> */}
                                                                LikeButton
                                                            </div>
                                                            {/* {item?.walletAddress?.toLowerCase() === account?.toLowerCase() && ( */}
                                                            <div className='drop_phonee'>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                            <path d="M6 6.5C6.27614 6.5 6.5 6.27614 6.5 6C6.5 5.72386 6.27614 5.5 6 5.5C5.72386 5.5 5.5 5.72386 5.5 6C5.5 6.27614 5.72386 6.5 6 6.5Z" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            <path d="M6 3C6.27614 3 6.5 2.77614 6.5 2.5C6.5 2.22386 6.27614 2 6 2C5.72386 2 5.5 2.22386 5.5 2.5C5.5 2.77614 5.72386 3 6 3Z" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                            <path d="M6 10C6.27614 10 6.5 9.77614 6.5 9.5C6.5 9.22386 6.27614 9 6 9C5.72386 9 5.5 9.22386 5.5 9.5C5.5 9.77614 5.72386 10 6 10Z" stroke="#E59572" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                                        </svg>
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        {/* <Dropdown.Item onClick={() => handleShow12(item?._id)} >Delete</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => handleShow112(item?.comment, item?.walletAddress, item?._id)}>Edit</Dropdown.Item> */}

                                                                        <Dropdown.Item>Delete</Dropdown.Item>
                                                                        <Dropdown.Item>Edit</Dropdown.Item>

                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                            {/* )} */}
                                                        </div>

                                                        <h5> item
                                                            {/* {item?.comment} */}
                                                        </h5></div>
                                                </>
                                                {/* )
                                                        })
                                                    )
                                                        :
                                                        <p>No Comments Found!</p>
                                                } */}

                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="v-pills-Threadnew" role="tabpanel" aria-labelledby="v-pills-Threadnew-tab">
                                            {/* <Transactiontable ticker={detail?.ticker} isMobile={true} contractAddress={detail?.contractAddress} /> */}
                                            Transactiontable
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </div>

                </div >
            </section >
            <Footer />

            <Offcanvas show={show} placement='bottom' onHide={handleClose} className="offcanvassnav2">

                <Offcanvas.Body>
                    <div className='drop_dowwn'>
                        <div className='inner_gems'>

                            <h3><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                                <g clip-path="url(#clip0_65_9331)">
                                    <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="white" />
                                    <path d="M10.4591 7.87793L6.68481 12.0163V14.7004L15.0019 23.1224L23.3152 14.705V13.6211H13.1604L13.8641 15.8588H18.5889L15.0011 19.4937L9.3021 13.7204L12.1958 10.5515H17.8064L19.043 11.9072H22.8485V11.5052L19.5401 7.87793H10.4591Z" fill="#329879" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_65_9331">
                                        <rect width="30" height="30" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>GEMS </h3>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M11.6668 3.5L5.25016 9.91667L2.3335 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <h2> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <g clip-path="url(#clip0_65_9341)">
                                <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="#627EEA" />
                                <path d="M15.4668 3.75V12.0656L22.4952 15.2062L15.4668 3.75Z" fill="white" fill-opacity="0.602" />
                                <path d="M15.4669 3.75L8.4375 15.2062L15.4669 12.0656V3.75Z" fill="white" />
                                <path d="M15.4668 20.5951V26.2455L22.4999 16.5151L15.4668 20.5951Z" fill="white" fill-opacity="0.602" />
                                <path d="M15.4669 26.2455V20.5942L8.4375 16.5151L15.4669 26.2455Z" fill="white" />
                                <path d="M15.4668 19.2871L22.4952 15.2061L15.4668 12.0674V19.2871Z" fill="white" fill-opacity="0.2" />
                                <path d="M8.4375 15.2061L15.4669 19.2871V12.0674L8.4375 15.2061Z" fill="white" fill-opacity="0.602" />
                            </g>
                            <defs>
                                <clipPath id="clip0_65_9341">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>ETH</h2>
                        <h2><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="#F3BA2F" />
                            <path d="M11.3588 13.5038L15 9.8625L18.6431 13.5056L20.7619 11.3869L15 5.625L9.24 11.385L11.3588 13.5038ZM5.625 15L7.74375 12.8812L9.8625 15L7.74375 17.1188L5.625 15ZM11.3588 16.4963L15 20.1375L18.6431 16.4944L20.7619 18.6122L15 24.375L9.24 18.615L9.23719 18.6122L11.3588 16.4963ZM20.1375 15L22.2563 12.8812L24.375 15L22.2563 17.1188L20.1375 15ZM17.1488 14.9981H17.1506V15L15 17.1506L12.8522 15.0037L12.8484 15L12.8522 14.9972L13.2281 14.6203L13.4109 14.4375L15 12.8494L17.1497 14.9991L17.1488 14.9981Z" fill="white" />
                        </svg>BNB</h2>
                        <h2> <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M21.9628 2.63954C21.1821 3.41144 20.4669 4.24805 19.8311 5.14013L19.6301 5.07542C18.4708 4.70102 17.2694 4.46991 16.0586 4.39134C15.694 4.3636 14.3336 4.3636 13.8895 4.39134C12.5479 4.47916 11.5194 4.67791 10.3508 5.08004C10.304 5.09853 10.2619 5.11239 10.2199 5.12626C9.56073 4.23881 8.8268 3.40682 8.01807 2.64416C11.8981 0.679745 16.4373 0.444015 20.4996 1.99244C20.9344 2.15421 21.3598 2.34372 21.7758 2.5471L21.9628 2.63954Z" fill="#F00500" />
                            <path d="M29.1993 20.1716C28.6103 21.8309 27.7268 23.3701 26.5815 24.7105C25.9597 25.4316 25.2725 26.0926 24.5339 26.6935C22.8043 28.0709 20.7848 29.0554 18.6297 29.5731C16.2456 30.1416 13.7586 30.1416 11.3745 29.5731C9.2148 29.0554 7.19999 28.0709 5.47034 26.6935C4.73173 26.0926 4.04454 25.4316 3.4228 24.7105C0.127106 20.8603 -0.873289 15.5725 0.804943 10.8071C1.12282 9.92427 1.52018 9.07379 1.997 8.26491C2.21671 7.89514 2.48785 7.47914 2.61874 7.30813C3.06752 9.21708 3.61913 10.8949 3.82482 11.5004C3.8108 11.5328 3.7921 11.5698 3.7734 11.6021C2.68419 13.7838 2.09517 15.8868 1.95493 18.124C1.95493 18.1517 1.95025 18.1841 1.95025 18.2118C1.91286 18.882 1.93155 19.2009 2.04375 19.6216C2.39435 20.9389 3.47422 22.3902 5.16648 23.8138C7.9386 26.1434 11.6971 27.8259 14.544 28.02C17.5125 28.2188 21.8927 26.5039 24.8097 23.9987C25.2679 23.5966 25.6979 23.1714 26.1 22.7184C26.3898 22.3856 26.8199 21.8125 26.7871 21.8125C26.7778 21.8125 26.7871 21.8032 26.8058 21.794C26.8199 21.7847 26.8339 21.7709 26.8245 21.7616C26.8199 21.757 26.8292 21.7431 26.8432 21.7385C26.8573 21.7339 26.8666 21.7246 26.8619 21.7154C26.8573 21.7061 26.8619 21.6969 26.8806 21.6923C26.8947 21.6877 26.8993 21.6738 26.8947 21.6645C26.89 21.6553 26.8947 21.6461 26.904 21.6461C26.9134 21.6461 26.9227 21.6322 26.9227 21.6229C26.9227 21.6137 26.9321 21.5998 26.9414 21.5998C26.9508 21.5998 26.9601 21.5906 26.9601 21.5813C26.9741 21.5444 26.9975 21.5074 27.0209 21.475C27.091 21.3687 27.3715 20.8742 27.4089 20.791C27.6753 20.1947 27.8436 19.6632 27.9231 19.1316C27.9605 18.8774 27.9839 18.4105 27.9652 18.2996C27.9605 18.2811 27.9605 18.2488 27.9558 18.1979C27.9465 18.1055 27.9418 17.9668 27.9325 17.8282C27.9231 17.6202 27.9044 17.329 27.8904 17.1857C27.6894 15.0872 27.1471 13.3724 26.1187 11.5559C26.0766 11.4866 26.0392 11.4172 26.0158 11.3618C26.0065 11.3479 26.0018 11.334 25.9971 11.3248C26.142 10.8949 26.7357 9.0969 27.2079 7.04004L27.2172 7.04928L27.2873 7.14173C27.4089 7.3035 27.7314 7.78421 27.8764 8.01531C28.5355 9.07841 29.0497 10.2201 29.4143 11.4126C30.2605 14.283 30.1904 17.3428 29.1993 20.1716Z" fill="#F00500" />
                            <path d="M23.1317 14.6481C23.1176 14.722 22.8979 14.9439 22.6782 15.1056C22.0331 15.5725 20.8784 16.007 19.7051 16.215C19.0366 16.3351 18.3681 16.3536 18.1671 16.2566C18.0362 16.1919 18.0175 16.141 18.0643 15.9746C18.1624 15.6279 18.4803 15.2489 18.9758 14.893C19.2283 14.7128 20.252 14.098 20.7289 13.8392C21.5142 13.4139 22.15 13.1597 22.5801 13.0996C22.7156 13.0811 22.8792 13.0765 22.9307 13.0996C23.0148 13.132 23.1083 13.377 23.1457 13.6728C23.1644 13.8299 23.155 14.5233 23.1317 14.6481Z" fill="black" />
                            <path d="M12.1179 16.1778C12.0898 16.2333 11.9496 16.2934 11.7907 16.3165C11.6317 16.3396 11.1456 16.3257 10.8697 16.2934C9.8787 16.164 8.82688 15.8635 8.06023 15.4938C7.63015 15.2858 7.32161 15.0778 7.09255 14.8513L6.96166 14.7172L6.94764 14.5416C6.92426 14.2365 6.92894 13.7558 6.96634 13.5848C6.98971 13.4415 7.04113 13.3029 7.11125 13.1781C7.14865 13.1318 7.14865 13.1318 7.31694 13.1318C7.52263 13.1318 7.69559 13.1642 7.97608 13.252C8.55107 13.4277 9.40655 13.8529 10.449 14.4723C11.3092 14.9807 11.6317 15.2303 11.8795 15.5723C12.0478 15.785 12.16 16.0854 12.1179 16.1778Z" fill="black" />
                            <path d="M18.7372 22.6117C18.7372 22.6256 18.6811 22.8474 18.611 23.1109C18.5409 23.3743 18.4848 23.587 18.4848 23.5962C18.4334 23.6008 18.3866 23.6055 18.3352 23.6008H18.1856L17.9799 24.0815C17.8677 24.345 17.7649 24.59 17.7509 24.627L17.7228 24.6917L17.6246 24.5345L17.5265 24.3774V23.097L17.4891 23.1063C17.4096 23.1248 16.844 23.1987 16.5962 23.2218C15.5724 23.3235 14.544 23.3004 13.5249 23.1571C13.3613 23.134 13.221 23.1155 13.2164 23.1201C13.2117 23.1248 13.2164 23.4206 13.2257 23.7857L13.2397 24.4421L13.1603 24.5622C13.1182 24.627 13.0761 24.6824 13.0761 24.687C13.0621 24.7009 13.0154 24.627 12.9078 24.4143C12.791 24.1925 12.7068 23.9567 12.646 23.7118L12.6133 23.5777L12.4684 23.587L12.3235 23.6008L12.2861 23.4298C12.2674 23.3374 12.244 23.1941 12.2347 23.1155L12.2206 22.9676L12.0991 22.8613C12.029 22.8012 11.9589 22.7411 11.9448 22.7319C11.9215 22.7134 11.9121 22.681 11.9121 22.6533V22.5978L12.4965 22.6024L13.0808 22.6071L13.0995 22.6672L13.1182 22.7272L13.3192 22.7365C13.4314 22.7411 13.7867 22.7504 14.1046 22.7596L14.6889 22.7735L14.8385 22.5424L14.9928 22.3113H15.1891L15.1844 21.8305L15.1798 21.3498L14.9226 21.2389C14.0952 20.8784 13.609 20.467 13.4267 19.9678C13.3893 19.8661 13.3893 19.8292 13.38 19.3669C13.3753 18.9093 13.3753 18.8677 13.408 18.7661C13.4735 18.5349 13.6558 18.3547 13.8895 18.2946C13.969 18.2715 14.1794 18.2715 15.2826 18.2715L16.5822 18.2761L16.7271 18.3454C16.9001 18.4286 16.9795 18.4887 17.0777 18.6181C17.1899 18.7661 17.2226 18.8816 17.2226 19.1636C17.2226 19.5657 17.1946 19.9124 17.1525 20.051C17.0917 20.2405 16.9982 20.4208 16.8814 20.5826C16.6476 20.8784 16.2222 21.1742 15.8342 21.3082L15.722 21.3498L15.7267 21.8352L15.7314 22.3205L15.8342 22.3297L15.9371 22.339L16.0773 22.547L16.2129 22.755H16.8393C17.1852 22.755 17.4891 22.7596 17.5171 22.7642C17.5639 22.7735 17.5732 22.7688 17.62 22.6903L17.6761 22.6071H18.2137C18.6157 22.5886 18.7372 22.5978 18.7372 22.6117Z" fill="black" />
                            <path d="M16.2692 23.9383C16.1804 23.9891 16.1196 24.0122 16.1056 24.003C16.0915 23.9984 16.0261 23.9429 15.956 23.8921L15.8297 23.7904L15.6989 23.929C15.4137 24.2341 15.4043 24.248 15.3202 24.2526C15.1893 24.2665 15.1613 24.2434 15.0023 24.0076C14.9182 23.8874 14.8527 23.7858 14.8527 23.7858C14.8527 23.7858 14.792 23.7765 14.7218 23.7719L14.5909 23.758L14.5302 23.8828L14.4694 24.0076L14.3619 23.9753C14.2777 23.9475 14.1936 23.9152 14.1141 23.8782L13.9739 23.8089V23.5454L15.2174 23.55L16.4608 23.5547L16.4655 23.6795C16.4702 23.8274 16.4749 23.8227 16.2692 23.9383Z" fill="black" />
                            <path d="M27.9559 18.2995C27.9513 18.281 27.9513 18.2486 27.9466 18.1978C26.8247 18.0776 23.6225 18.0036 20.6493 20.4303C20.6493 20.4303 19.691 16.0854 15.2032 16.0854C10.7155 16.0854 9.05129 20.4303 9.05129 20.4303C6.53629 17.754 3.17047 17.9482 1.95504 18.1238C1.95504 18.1516 1.95037 18.1839 1.95037 18.2116C1.91297 18.8819 1.93167 19.2008 2.04386 19.6214C2.39447 20.9387 3.47433 22.3901 5.16659 23.8137C7.93871 26.1433 11.6972 27.8257 14.5441 28.0199C17.5126 28.2186 21.8928 26.5038 24.8098 23.9986C25.268 23.5965 25.698 23.1712 26.1001 22.7182C26.3899 22.3854 26.82 21.8123 26.7873 21.8123C26.7779 21.8123 26.7873 21.8031 26.806 21.7938C26.82 21.7846 26.834 21.7707 26.8247 21.7615C26.82 21.7568 26.8293 21.743 26.8434 21.7383C26.8574 21.7337 26.8667 21.7245 26.8621 21.7152C26.8574 21.706 26.8621 21.6967 26.8808 21.6921C26.8948 21.6875 26.8994 21.6736 26.8948 21.6644C26.8901 21.6551 26.8948 21.6459 26.9041 21.6459C26.9135 21.6459 26.9228 21.632 26.9228 21.6228C26.9228 21.6135 26.9322 21.5997 26.9415 21.5997C26.9509 21.5997 26.9602 21.5904 26.9602 21.5812C26.9742 21.5442 26.9976 21.5072 27.021 21.4749C27.0911 21.3686 27.3716 20.874 27.409 20.7908C27.6755 20.1945 27.8437 19.663 27.9232 19.1315C27.9513 18.8772 27.9746 18.4104 27.9559 18.2995ZM16.2691 23.9385C16.1803 23.9893 16.1195 24.0124 16.1055 24.0032C16.0915 23.9986 16.026 23.9431 15.9559 23.8923L15.8297 23.7906L15.6988 23.9293C15.4136 24.2343 15.4043 24.2482 15.3201 24.2528C15.1892 24.2667 15.1612 24.2436 15.0022 24.0078C14.9181 23.8877 14.8526 23.786 14.8526 23.786C14.8526 23.786 14.7919 23.7767 14.7218 23.7721L14.5909 23.7582L14.5301 23.883L14.4693 24.0078L14.3618 23.9755C14.2777 23.9477 14.1935 23.9154 14.114 23.8784L13.9738 23.8091V23.5456L15.2173 23.5502L16.4608 23.5549L16.4654 23.6797C16.4701 23.8276 16.4748 23.8229 16.2691 23.9385ZM18.6065 23.1065C18.5363 23.37 18.4802 23.5826 18.4802 23.5918C18.4288 23.5965 18.3821 23.6011 18.3307 23.5965H18.1811L17.98 24.0818C17.8679 24.3452 17.765 24.5902 17.751 24.6272L17.7229 24.6919L17.6248 24.5348L17.5266 24.3776V23.0973L17.4892 23.1065C17.4097 23.125 16.8441 23.199 16.5963 23.2221C15.5726 23.3237 14.5441 23.3006 13.525 23.1574C13.3614 23.1342 13.2212 23.1158 13.2165 23.1204C13.2118 23.125 13.2165 23.4208 13.2258 23.786L13.2399 24.4423L13.1604 24.5625C13.1183 24.6272 13.0762 24.6827 13.0762 24.6873C13.0622 24.7011 13.0155 24.6272 12.908 24.4146C12.7911 24.1927 12.7069 23.957 12.6462 23.712L12.6134 23.578L12.4685 23.5872L12.3236 23.6011L12.2862 23.4301C12.2675 23.3376 12.2441 23.1943 12.2348 23.1157L12.2208 22.9678L12.0992 22.8615C12.0291 22.8014 11.959 22.7414 11.945 22.7321C11.9216 22.7136 11.9122 22.6813 11.9122 22.6535V22.5981L12.4966 22.6027L13.0809 22.6073L13.0996 22.6674L13.1183 22.7275L13.3193 22.7367C13.4315 22.7414 13.7868 22.7506 14.1047 22.7598L14.689 22.7737L14.8386 22.5426L14.9929 22.3115H15.1892L15.1845 21.8308L15.1799 21.3501L14.9228 21.2392C14.0953 20.8786 13.6092 20.4673 13.4268 19.9681C13.3895 19.8664 13.3895 19.8294 13.3801 19.3672C13.3754 18.9096 13.3754 18.868 13.4081 18.7663C13.4736 18.5352 13.6559 18.3549 13.8896 18.2948C13.9691 18.2717 14.1795 18.2717 15.2827 18.2717L16.5823 18.2764L16.7272 18.3457C16.9002 18.4289 16.9796 18.489 17.0778 18.6184C17.19 18.7663 17.2227 18.8819 17.2227 19.1638C17.2227 19.5659 17.1947 19.9126 17.1526 20.0513C17.0918 20.2408 16.9984 20.421 16.8815 20.5828C16.6477 20.8786 16.2223 21.1744 15.8343 21.3085L15.7221 21.3501L15.7268 21.8354L15.7315 22.3207L15.8343 22.33L15.9372 22.3392L16.0774 22.5472L16.213 22.7552H16.8394C17.1853 22.7552 17.4892 22.7598 17.5172 22.7645C17.564 22.7737 17.5733 22.7691 17.6201 22.6905L17.6762 22.6073H18.2138C18.6298 22.6073 18.7514 22.6119 18.7514 22.6258C18.7374 22.6212 18.6766 22.8477 18.6065 23.1065Z" fill="white" />
                            <path d="M27.9184 17.8279C27.9091 17.6199 27.8904 17.3287 27.8763 17.1854C27.6753 15.087 27.1331 13.3722 26.1046 11.5557C26.0625 11.4863 26.0251 11.417 26.0018 11.3615C25.9924 11.3477 25.9877 11.3338 25.9831 11.3246C26.128 10.8947 26.7217 9.09667 27.1938 7.03981C27.8343 4.24803 28.241 0.984785 26.9975 0.00488712C26.9975 0.00488712 24.8471 -0.152266 21.9675 2.63952C21.1868 3.41142 20.4715 4.24803 19.8358 5.1401L19.6348 5.07539C18.4754 4.701 17.274 4.46989 16.0633 4.39131C15.6986 4.36358 14.3383 4.36358 13.8942 4.39131C12.5525 4.47914 11.5241 4.67789 10.3554 5.08002C10.3087 5.0985 10.2666 5.11237 10.2245 5.12624C9.56538 4.23878 8.83145 3.4068 8.02272 2.64414C5.02621 -0.16151 2.79636 0.000264684 2.79636 0.000264684C1.47808 1.01252 1.92686 4.42367 2.60937 7.3079C3.05815 9.21685 3.60976 10.8947 3.81545 11.5002C3.80143 11.5325 3.78273 11.5695 3.76403 11.6019C2.67482 13.7835 2.0858 15.8866 1.94556 18.1237C3.16566 17.9481 6.5268 17.7494 9.04649 20.4302C9.04649 20.4302 10.7107 16.0854 15.1984 16.0854C19.6862 16.0854 20.6445 20.4302 20.6445 20.4302C23.6176 18.0036 26.8198 18.0821 27.9418 18.1977C27.9371 18.1053 27.9278 17.9666 27.9184 17.8279ZM4.69898 9.75764C4.69898 9.75764 2.95062 5.43592 3.3994 2.96769C3.4742 2.5517 3.61444 2.18654 3.83415 1.90922C3.83415 1.90922 5.81624 2.10335 9.01376 5.61619C9.01376 5.61619 8.40605 5.90738 7.59264 6.52675C7.59264 6.52675 7.58797 6.53137 7.58329 6.53137C6.69977 7.20159 5.56848 8.26468 4.69898 9.75764ZM12.1178 16.1778C12.0897 16.2333 11.9495 16.2934 11.7906 16.3165C11.6316 16.3396 11.1454 16.3257 10.8696 16.2934C9.87859 16.164 8.82677 15.8635 8.06012 15.4937C7.63004 15.2857 7.32151 15.0777 7.09244 14.8513L6.96155 14.7172L6.94753 14.5416C6.92415 14.2365 6.92883 13.7558 6.96623 13.5848C6.9896 13.4415 7.04102 13.3028 7.11114 13.178C7.14854 13.1318 7.14854 13.1318 7.31683 13.1318C7.52252 13.1318 7.69549 13.1642 7.97597 13.252C8.55096 13.4276 9.40644 13.8529 10.4489 14.4722C11.3091 14.9807 11.6316 15.2303 11.8794 15.5723C12.0477 15.7849 12.1599 16.0854 12.1178 16.1778ZM23.1315 14.6479C23.1174 14.7218 22.8977 14.9437 22.678 15.1055C22.0329 15.5723 20.8783 16.0068 19.7049 16.2148C19.0364 16.335 18.3679 16.3535 18.1669 16.2564C18.036 16.1917 18.0173 16.1408 18.0641 15.9744C18.1622 15.6278 18.4801 15.2488 18.9756 14.8929C19.2281 14.7126 20.2518 14.0978 20.7287 13.839C21.514 13.4138 22.1498 13.1595 22.5799 13.0995C22.7154 13.081 22.879 13.0764 22.9305 13.0995C23.0146 13.1318 23.1081 13.3768 23.1455 13.6726C23.1642 13.8298 23.1548 14.5231 23.1315 14.6479ZM22.3555 6.52675L22.3461 6.52213C21.5608 5.90276 20.9717 5.61156 20.9717 5.61156C24.0617 2.09872 25.9737 1.90459 25.9737 1.90459C26.1841 2.18655 26.3196 2.54707 26.3944 2.96307C26.8292 5.4313 25.1416 9.75764 25.1416 9.75764C24.4357 8.51428 23.4868 7.41421 22.3555 6.52675Z" fill="#FFA409" />
                            <path d="M26.3993 2.96326C26.0347 2.91704 24.3097 2.90779 22.3556 6.52694L22.3463 6.52232C21.5609 5.90295 20.9719 5.61176 20.9719 5.61176C24.0619 2.09891 25.9739 1.90479 25.9739 1.90479C26.1889 2.18674 26.3245 2.54726 26.3993 2.96326Z" fill="#FF9300" />
                            <path d="M25.1465 9.75785C24.436 8.50987 23.4917 7.41442 22.3557 6.52697C24.3098 2.90782 26.0301 2.91706 26.3994 2.96328C26.8341 5.43614 25.1465 9.75785 25.1465 9.75785Z" fill="#FF8300" />
                            <path d="M26.4687 2.97724C26.4456 2.97262 26.4225 2.968 26.3994 2.96338L26.4687 2.97724Z" fill="#FF8300" />
                            <path d="M9.01381 5.61176C9.01381 5.61176 8.4061 5.90295 7.59269 6.52232C7.59269 6.52232 7.58802 6.52694 7.58334 6.52694C5.55918 2.90317 3.7781 2.91704 3.39478 2.96326C3.46957 2.54726 3.60982 2.18211 3.82953 1.90479C3.8342 1.90479 5.81629 2.09891 9.01381 5.61176Z" fill="#FF9300" />
                            <path d="M7.58816 6.52697C6.69996 7.2018 5.56867 8.26028 4.69917 9.75785C4.69917 9.75785 2.95082 5.43614 3.39959 2.96328C3.77825 2.91706 5.564 2.90782 7.58816 6.52697Z" fill="#FF8300" />
                            <path d="M3.39866 2.96338C3.37555 2.968 3.34782 2.97262 3.32471 2.97724L3.39866 2.96338Z" fill="#FF8300" />
                            <path d="M20.4154 12.1565C20.4154 12.1565 18.9195 12.2489 19.1065 11.0934C19.2935 9.93782 20.4622 9.79916 20.7894 9.84538C21.1166 9.8916 22.4256 10.3538 22.1918 11.3245C21.9581 12.2951 21.6309 12.1102 21.4439 12.1565C21.2569 12.2027 20.4154 12.1565 20.4154 12.1565Z" fill="white" />
                            <path d="M9.38321 12.1565C9.38321 12.1565 7.88729 12.2489 8.07428 11.0934C8.26127 9.93782 9.42996 9.79916 9.75719 9.84538C10.0844 9.8916 11.3933 10.3538 11.1596 11.3245C10.9259 12.2951 10.5986 12.1102 10.4117 12.1565C10.2247 12.2027 9.38321 12.1565 9.38321 12.1565Z" fill="white" />
                        </svg>SHIB</h2>
                        <h2><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <path d="M15 0C23.285 0 30 6.71632 30 15C30 23.285 23.285 30 15 30C6.71632 30 0 23.2844 0 15C0 6.71632 6.71632 0 15 0Z" fill="#F5AC37" />
                            <path d="M15.5527 16.0592H21.2525C21.374 16.0592 21.4314 16.0592 21.4402 15.8999C21.4867 15.3201 21.4867 14.7369 21.4402 14.1564C21.4402 14.0436 21.3841 13.9971 21.262 13.9971H9.91846C9.77806 13.9971 9.74026 14.0436 9.74026 14.1753V15.8439C9.74026 16.0592 9.74026 16.0592 9.96504 16.0592H15.5527ZM20.8036 12.047C20.8198 12.0044 20.8198 11.9579 20.8036 11.916C20.7084 11.7088 20.5957 11.511 20.4648 11.3254C20.2677 11.0081 20.0355 10.7159 19.7709 10.4533C19.646 10.2947 19.5015 10.1522 19.3395 10.0314C18.5282 9.34087 17.5636 8.85216 16.5268 8.60646C16.0036 8.48901 15.469 8.43298 14.9331 8.43771H9.89889C9.75849 8.43771 9.73959 8.49373 9.73959 8.61591V11.9437C9.73959 12.0841 9.73959 12.1219 9.91779 12.1219H20.7361C20.7361 12.1219 20.8299 12.103 20.8488 12.047H20.8029H20.8036ZM20.8036 18.0093C20.6443 17.9918 20.4837 17.9918 20.3244 18.0093H9.92791C9.78751 18.0093 9.74026 18.0093 9.74026 18.197V21.4505C9.74026 21.6003 9.74026 21.6381 9.92791 21.6381H14.7279C14.9574 21.6557 15.1869 21.6395 15.4117 21.5916C16.1083 21.5416 16.7934 21.3904 17.4468 21.1413C17.6844 21.059 17.9139 20.9517 18.1306 20.8227H18.1961C19.3213 20.2375 20.2353 19.3181 20.8117 18.1895C20.8117 18.1895 20.8772 18.0478 20.8036 18.0107V18.0093ZM7.85632 23.325V23.269V21.0846V20.3442V18.1409C7.85632 18.0188 7.85632 18.0005 7.70647 18.0005H5.672C5.55927 18.0005 5.5127 18.0005 5.5127 17.8507V16.0693H7.68757C7.80907 16.0693 7.85632 16.0693 7.85632 15.91V14.1476C7.85632 14.0349 7.85632 14.0072 7.70647 14.0072H5.672C5.55927 14.0072 5.5127 14.0072 5.5127 13.8573V12.2076C5.5127 12.1043 5.5127 12.0767 5.66255 12.0767H7.67812C7.81852 12.0767 7.85632 12.0767 7.85632 11.8985V6.84537C7.85632 6.69552 7.85632 6.65771 8.04397 6.65771H15.0748C15.5851 6.67797 16.0921 6.73399 16.5936 6.82647C17.627 7.01749 18.62 7.38672 19.5279 7.9139C20.13 8.26828 20.6841 8.69624 21.1776 9.18899C21.5488 9.57442 21.8836 9.99157 22.1806 10.4357C22.4756 10.886 22.7206 11.3672 22.913 11.8701C22.9366 12.0011 23.0622 12.0895 23.1931 12.0672H24.8712C25.0865 12.0672 25.0865 12.0672 25.096 12.2738V13.8114C25.096 13.9613 25.04 13.9991 24.8894 13.9991H23.5955C23.4645 13.9991 23.4267 13.9991 23.4362 14.1678C23.4875 14.7389 23.4875 15.312 23.4362 15.883C23.4362 16.0423 23.4361 16.0612 23.615 16.0612H25.0953C25.1608 16.1456 25.0953 16.23 25.0953 16.315C25.1048 16.4237 25.1048 16.5337 25.0953 16.6424V17.7771C25.0953 17.9364 25.0487 17.9837 24.9077 17.9837H23.1358C23.0122 17.96 22.8921 18.039 22.8637 18.1619C22.4419 19.2587 21.7669 20.2422 20.8947 21.0306C20.5761 21.3175 20.2413 21.5875 19.8917 21.8366C19.5164 22.0526 19.1512 22.2774 18.7665 22.4556C18.0584 22.7742 17.3159 23.0091 16.5538 23.1583C15.8302 23.2879 15.0964 23.3466 14.36 23.3365H7.85362V23.327L7.85632 23.325Z" fill="#FEFEFD" />
                        </svg>DAI</h2>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>




            <Modal className='token' show={show2} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='success_modal'>
                        <img src='\asset\tick.svg' />
                        <h5>Success!</h5>
                        <button onClick={handleClose2}>Okay</button>
                    </div>

                </Modal.Body>

            </Modal>




            <Modal className='token' show={show12} onHide={handleClose12} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='success_modal'>
                        <img src='\asset\delimgg.svg' />
                        <h6>Delete your comment permanently?</h6>
                        <div className='delllete'>
                            <button className='cannncel' onClick={handleClose12}>Cancel</button>
                            <button disabled={commentDisable} className='delete' > {commentDisable ? <Spinner size="sm" /> :
                                "Delete"}</button>
                        </div>

                    </div>

                </Modal.Body>

            </Modal>




            <Modal className='token' show={show112} onHide={handleClose112} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='success_modal'>
                        <textarea id="w3review" name="w3review" maxLength={300} rows={4} cols={50} placeholder='Comment' value={updateComment} onChange={(e) => setUpdateComment(e.target.value)} />

                        <div className='delllete'>
                            <button className='cannncel' onClick={handleClose112}>Cancel</button>
                            <button disabled={commentDisable}>
                                {commentDisable ? <Spinner size="sm" /> :
                                    "Save Changes"}
                            </button>
                        </div>
                    </div>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default page
