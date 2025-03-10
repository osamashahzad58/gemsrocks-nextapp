"use client";
import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Navbar from '../components/Landingpage/navbar';
import Footer from '../components/Footer';


const page = () => {
    // const { refreshTokenApi } = RefreshToken();
    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const toggleOptions = () => {
        setShowMoreOptions(!showMoreOptions);
    };

    // const { CreateTokenHook } = CreateToken();
    const [loader, setLoader] = useState(false);
    // const { BalanceHook } = Balance();
    // let { account } = useWeb3React();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [projectName, setProjectName] = useState("");
    const [ticker, setTicker] = useState("");
    const [description, setDescription] = useState("");
    const [twitter, setTwitter] = useState("");
    const [telegram, setTelegram] = useState("");
    const [discord, setDiscord] = useState("");
    const [youtube, setYoutube] = useState("");
    const [website, setWebsite] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [projectBannerImg, setProjectBannerImg] = useState("");
    const [logoFile, setLogoFile] = useState<FormData | null>(null);
    const [projectImageUrl, setProjectImageUrl] = useState("");
    // const { isAllowanceRequired } = useHandleAllowanceCheck();
    const [projectId, setProjectId] = useState("");
    const [loaderMessage, setLoaderMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const activeCreateButton = !!projectBannerImg && !!projectName && !!ticker;

    const createTokenHandle = async () => {
        // let token = localStorage?.getItem("accessToken");
        // if (!account) {
        //     toast?.error("Please connect your wallet");
        //     return;
        // }
        // setLoader(true);
        // setLoaderMessage("Image Uploading");
        // try {
        //     const { data: imageUrl } = await axios.post(`${api_url}file/upload`, logoFile, {
        //         headers: { "Authorization": `Bearer ${token}` },
        //     });
        //     setImageUrl(imageUrl);
        //     setLoaderMessage("Confirm Create Transaction");

        //     const futureTimestamp = Math.floor((Date.now() + 120000) / 1000);
        //     const res = await CreateTokenHook(projectName, ticker?.toUpperCase(),imageUrl, futureTimestamp);

        //     if (res) {
        //         const { events, transactionHash } = res;
        //         const contractAddress = events?.Launch?.returnValues?.rock;
        //         const pair = events?.Launch?.returnValues?.pair;

        //         setContractAddress(contractAddress);
        //         await createToken(contractAddress, transactionHash, pair, imageUrl);
        //     }
        //     return res;
        // } catch (error) {
        //     if (error.response?.status === 401) {
        //         try {
        //             const newToken = await refreshTokenApi();
        //             if (newToken) return createTokenHandle();
        //         } catch (refreshError) {
        //             console.error("Error in refresh token:", refreshError);
        //             toast.error("Session expired. Please login again.");
        //         }
        //     } else {
        //         console.error("Error in createTokenHandle:", error);
        //         setImageUrl("");
        //         setLoader(false);

        //         const errorMsg = error?.code === 4001 ? "User Rejected!" : "Transaction Failed!";
        //         toast?.error(errorMsg);
        //     }
        // }
    };



    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validTypes.includes(file.type)) {
                // toast.error("Incorrect Image Type");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                // toast.error("Image must be less than 5MB");
                return;
            }

            const fileName = file.name.replace(/\s+/g, "_");
            const newFile = new File([file], fileName, { type: file.type });

            const imageUrl = URL.createObjectURL(newFile);
            const formData = new FormData();
            formData.append("image", newFile);

            setLogoFile(formData);
            setProjectBannerImg(imageUrl);
        }
    };


    const removeImg = () => {
        setProjectBannerImg("");
        setLogoFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    const handleCopy = () => {
        if (contractAddress) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(contractAddress)
                    .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    })
                    .catch((err) => { });
            } else {
                // Fallback for unsupported environments
                const textArea = document.createElement("textarea");
                textArea.value = contractAddress;
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

    const handleClose = () => {
        setShow(false);
        setProjectName("");
        setTicker("");

    };
    const handleShow = () => setShow(true);

    const createToken = async () => {
        // setLoaderMessage("Processing...")
        // const token = localStorage?.getItem("accessToken");
        // setLoader(true);
        // if (!account) {
        //     toast.error("Connect Wallet To Create")
        //     return;
        // }
        // try {
        //     const payload = {
        //         projectName: projectName,
        //         ticker: ticker?.toUpperCase(),
        //         projectDescription: description,
        //         pfp: fileUpload,
        //         creatorAddress: account,
        //         contractAddress: contractAddress,
        //         pairAddress: pairAddress,
        //         txHash: transactionHash,
        //         twitter: twitter,
        //         telegram: telegram,
        //         youtube: youtube,
        //         discord: discord,
        //         website: website,
        //     };
        //     const collectionResponse = await axios.post(`${api_url}project/create-project`, payload, {
        //         headers: {
        //             "Authorization": `Bearer ${token}`,
        //         },
        //     });

        //     if (collectionResponse) {
        //         setProjectImageUrl(fileUpload?.data);
        //         setProjectId(collectionResponse?.data?.data?._id);
        //     }
        //     removeImg();
        //     setDescription("");
        //     setYoutube("");
        //     setTelegram("");
        //     setDiscord("");
        //     setTwitter("");
        //     setWebsite("");
        //     setLogoFile("");
        //     handleShow();
        //     setLoader(false);
        // } catch (error) {
        //     setLoader(false);
        //     toast.error(error.message);
        // }
    };

    return (
        <>
            {/* {loader && <Loader text={loaderMessage} />} */}
            <Navbar />
            <section className='createnewtoken'>
                <div className='custom-container'>
                    <div className='parentbox'>
                        <h2 >Create New Token</h2>
                        <div className='parenttextmain'>
                            <div className='left'>
                                <div className="mainbox">
                                    {projectBannerImg ? (
                                        <img src={projectBannerImg} alt="img" className="img-fluid innerimg" />
                                    ) : (
                                        <img src="/asset/editpic.png" alt="img" className="img-fluid" />
                                    )}
                                </div>

                            </div>
                            <div className='right'>
                                <h6>Project Image</h6>
                                <p>We recommend to upload images in 400x400 resolution. Max 5 MB in JPEG, GIF or PNG format</p>
                                <div className='parentbuttons'>
                                    <div className='wrapper'>
                                        <label htmlFor='upload' className='upload'>
                                            Upload
                                        </label>

                                        <input type='file' ref={fileInputRef} onChange={(e) => handleImageUpload(e)} id='upload' placeholder='hhhhhhhhhh' className='d-none' />
                                    </div>

                                    {/* <button className='upload'>Change</button> */}
                                    {projectBannerImg ?
                                        <button className='remove' onClick={() => removeImg()}>Remove</button> : ''}
                                </div>
                            </div>
                        </div>
                        <div className='maininputs'>
                            <div className='innerinputs'>
                                <p >Project Name</p>
                                <input type='text' maxLength={15} placeholder='Enter project name' value={projectName} onChange={(e) => setProjectName(e?.target?.value)} />
                            </div>
                            <div className='innerinputs'>
                                <p>Ticker</p>
                                <div className='newton_div'>
                                    <p>$</p>
                                    <input className='input_newton' maxLength={10} type='text' placeholder='Enter Token Ticker' value={ticker} onChange={(e) => setTicker(e?.target?.value)} />

                                </div>
                            </div>
                            <div>
                                {!showMoreOptions ? (
                                    <h3 className="showmore_div" onClick={toggleOptions}>
                                        Show more options
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 3.33333V12.6667" stroke="#311E1A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6668 8L8.00016 12.6667L3.3335 8" stroke="#311E1A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </h3>
                                ) : (
                                    <h3 className="showmore_div hide_texttt" onClick={toggleOptions}>
                                        Hide more options
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M8 12.6666V3.33329" stroke="#311E1A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6668 8L8.00016 3.33333L3.3335 8" stroke="#311E1A" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </h3>
                                )}

                                {showMoreOptions && (
                                    <div className="midddle_define">
                                        <div className="innerinputs">
                                            <div className="parenttext">
                                                <p>Project Short Description</p>
                                                <h6>Less than 150 Characters</h6>
                                            </div>
                                            <textarea
                                                value={description}
                                                onChange={(e) => setDescription(e?.target?.value)}
                                                maxLength={150}
                                                placeholder="Project Short Description"
                                            />
                                        </div>
                                        <div className="innerinputs">
                                            <p>X (Twitter)</p>
                                            <input value={twitter} onChange={(e) => setTwitter(e?.target?.value)} type="text" placeholder="Twitter" />
                                        </div>
                                        <div className="innerinputs">
                                            <p>Telegram</p>
                                            <input value={telegram} onChange={(e) => setTelegram(e?.target?.value)} type="text" placeholder="Telegram" />
                                        </div>
                                        <div className="innerinputs">
                                            <p>Discord</p>
                                            <input value={discord} onChange={(e) => setDiscord(e?.target?.value)} type="text" placeholder="Discord" />
                                        </div>
                                        <div className="innerinputs">
                                            <p>YouTube</p>
                                            <input value={youtube} onChange={(e) => setYoutube(e?.target?.value)} type="text" placeholder="YouTube" />
                                        </div>
                                        <div className="innerinputs">
                                            <p>Website</p>
                                            <input value={website} onChange={(e) => setWebsite(e?.target?.value)} type="text" placeholder="https//:" />
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                        <div className='lastbuttons'>
                            <button className={activeCreateButton ? "active" : 'dull'} onClick={createTokenHandle} disabled={!activeCreateButton}>Create Token</button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <Modal className='token' show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Token Created</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='parent' style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className='mainimage'>
                            <img src={imageUrl} alt='img' className='img-fluid innerimage' />
                        </div>
                        <p>{projectName}</p>
                        <h6>${ticker}</h6>
                        <h2 className='mainheading'>Token created successfully!</h2>
                        <p className='mainpara'>Here’s the contract address.</p>
                        <div className="bottombox" style={{ textAlign: 'center', flexDirection: 'column' }}>
                            <p>{contractAddress?.slice(0, 20)}.....{contractAddress?.slice(-4)}<svg
                                className='svgggg'
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                onClick={handleCopy}
                                style={{ cursor: "pointer", marginBottom: '5px' }}
                            >
                                <g clipPath="url(#clip0_38_1375)">
                                    <path d="M10.0005 4H5.00049C4.4482 4 4.00049 4.44772 4.00049 5V10C4.00049 10.5523 4.4482 11 5.00049 11H10.0005C10.5528 11 11.0005 10.5523 11.0005 10V5C11.0005 4.44772 10.5528 4 10.0005 4Z" stroke="#E59572" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2.00049 8C1.45049 8 1.00049 7.55 1.00049 7V2C1.00049 1.45 1.45049 1 2.00049 1H7.00049C7.55049 1 8.00049 1.45 8.00049 2" stroke="#E59572" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_38_1375">
                                        <rect width="12" height="12" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg></p>


                            {copied && <p style={{ color: '#E59572', marginTop: '5px', fontSize: '14px', textAlign: 'end', display: 'flex' }}>Copied!</p>}
                        </div>
                        <div className='continuebuttton'>
                            {/* <Link to={`/coin/${projectId}`}> */}
                            {/* </Link> */}
                            <button>Continue</button>
                        </div>
                    </div>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default page;
