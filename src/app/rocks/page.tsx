"use client";
import React, { useEffect, useState } from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import Pagination from 'react-bootstrap/Pagination';
import Navbar from '../components/Landingpage/navbar';
import Footer from '../components/Footer';
import Offcanvas from 'react-bootstrap/Offcanvas';

const page = () => {
    const token = localStorage?.getItem("accessToken")
    const [loader, setLoader] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortShow, setSortShow] = useState("New to Old");
    const [sortDis, setSortDis] = useState("desc");
    const [show, setShow] = useState(false);
    const [rock, setRock] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);  // This will be updated based on API response
    const [totalItems, setTotalItems] = useState(0);
    const [ethPrice, setEthPrice] = useState(0);
    const socketEvent = `NewProject`
    const [shake, setShake] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);


    // const events = [
    //     {
    //         eventName: socketEvent,
    //         handler: (data) => {
    //             if (data !== null) {
    //                 setRock([data, ...rock])
    //                 setShake(true);
    //                 setTimeout(() => {
    //                     setShake(false);
    //                 }, 1500);
    //             }
    //         },
    //     }
    // ];
    // useSocketEvents(events);

    const handlePageChange = (page: any) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);  // Set the currentPage to the selected page
        }
    };

    const pageItems = [];
    for (let i = 1; i <= totalPages; i++) {
        pageItems.push(i);  // Create an array of page numbers
    }

    const getRocks = async () => {
        // if (!search) {
        //     setLoader(true);
        // }
        // try {
        //     const { data } = await axios.get(`${api_url}project/get-all-projects-filtered?limit=12&page=${currentPage}&searchParam=${search}&sortBy=${sortBy}&sortDirection=${sortDis}`,);
        //     setRock(data?.data?.projects);
        //     setTotalPages(data?.data?.totalPages); // Assuming has totalPages
        //     setTotalItems(data?.data?.total);
        //     setLoader(false);
        // } catch (error) {
        //     // console.error("Error fetching gift collections:", error);
        //     setLoader(false);
        // }
    };
    useEffect(() => {
        getRocks()
    }, [currentPage, debouncedSearch, sortBy, sortDis]);

    const fetchEthValue = async () => {
        // const ethAmount = await ethToDollarConverter();
        // setEthPrice(ethAmount);
    };

    useEffect(() => {
        window?.scroll(0, 0)
        fetchEthValue()
    }, []);

    return (
        <>
            {/* {loader && <Loader />} */}
            <Navbar />
            <section className='Main_Rock'>
                <div className="custom-container">
                    <div className='Top_rocks'>
                        <div className='rocks_bgdiv'>
                            <h1 className='rockshtag'>ROCKS READY TO </h1>
                            <h1>BECOME GEMS </h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className='another_rocks'>
                <div className="custom-container">
                    <div className='bottom_rocks'>
                        <div className='input_main'>
                            <div className='input_div'>
                                <svg className='searchsvg' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.5 17.5L13.9167 13.9167" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <input type="text" id="username" name="username" placeholder='Search by name or CA' value={search} onChange={(e) => setSearch(e?.target?.value)} />
                            </div>
                            <div className='dropdown_div'>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Sort: {sortShow}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M5 7.5L10 12.5L15 7.5" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => { setSortBy("createdAt"); setSortDis("desc"); setSortShow("New to Old") }}>Age: New to Old
                                            {sortBy == "createdAt" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setSortBy("createdAt"); setSortDis("asc"); setSortShow("Old to New") }} >Age: Old to New
                                            {sortBy == "createdAt" && sortDis == "asc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setSortBy("projectName"); setSortDis("asc"); setSortShow("Ascending") }}>Name: Ascending
                                            {sortBy == "projectName" && sortDis == "asc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setSortBy("projectName"); setSortDis("desc"); setSortShow("Descending") }} >Name: Descending
                                            {sortBy == "projectName" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => { setSortBy("marketcap"); setSortDis("desc"); setSortShow("Market Cap") }}>Market Cap
                                            {sortBy == "marketcap" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <button onClick={handleShow} className="Sort d-none">Sort: {sortShow} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 6L8 10L12 6" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg></button>
                        </div>
                        {/* <div className='cards_section'>
                            {
                                rock && rock?.length > 0 ? (
                                    rock?.map((item, index) => {
                                        return (
                                            <>
                                                <Link to={`/coin/${item?._id}`} >
                                                    <div key={index} className={index === 0 && shake ? "card_one shake" : "card_one"}>
                                                        <div className='img_text'>
                                                            <img src={item.pfp ? item?.pfp : "asset/broken.png"} className='angryimg' />
                                                            <div>
                                                                <h1>{item?.projectName}</h1>
                                                                <h2>${item?.ticker}</h2>
                                                                <h3>{getTimeInAges(item?.createdAt)}</h3>
                                                            </div>
                                                        </div>
                                                        <div className='bottom_cards'>
                                                            <div>
                                                                <h4>Market Cap</h4>
                                                                <h5> {item?.isGraduated ? (+item?.marketcap) >= 1 ? `$${formatMarketCap(+item?.marketcap)}` : "< $1" : (+item?.marketcap) >= 1 ? `$${formatEthinDollar(+item?.marketcap, ethPrice)}` : "< $1"}</h5>
                                                            </div>
                                                            <div>
                                                                <h4>Created By</h4>
                                                                <h5>{item?.creatorAddress.slice(0, 7)}...{item?.creatorAddress.slice(-3)}</h5>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Link>

                                            </>
                                        )
                                    })
                                )
                                    :
                                    <p>No Data Found!</p>
                            }

                        </div> */}
                        {totalPages > 1 &&
                            <div className="pagination_mains">
                                <div>
                                    <h6>SHOWING {(currentPage - 1) * 12 + 1}-{Math.min(currentPage * 12, totalItems)} OF {totalItems}</h6>
                                </div>
                                <div className="innner_pagi">
                                    <Pagination >
                                        {
                                            +currentPage > 1 &&
                                            <div className='rightsideee'>
                                                <img
                                                    src="/asset/leftarrow.svg"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    style={{ cursor: 'pointer' }}
                                                    className='imggggggright'
                                                />
                                            </div>
                                        }
                                        {currentPage > 5 && <Pagination.Ellipsis />}
                                        {pageItems.slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, totalPages - 1)).map((page) => (
                                            <Pagination.Item
                                                key={page}
                                                active={page === +currentPage}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Pagination.Item>
                                        ))}
                                        {currentPage < totalPages - 2 && <Pagination.Ellipsis />}
                                        {totalPages > 1 && (
                                            <Pagination.Item active={+currentPage === +totalPages} onClick={() => handlePageChange(totalPages)}>
                                                {totalPages}
                                            </Pagination.Item>
                                        )}
                                        {
                                            +totalPages != +currentPage &&
                                            <div className='rightsideee'>
                                                <img
                                                    src="/asset/rightarrow.svg"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    style={{ cursor: 'pointer' }}
                                                    className='imggggggright'
                                                />
                                            </div>
                                        }

                                    </Pagination>
                                </div>
                            </div>}
                    </div>
                </div>
            </section>



            <Footer />

            <Offcanvas show={show} placement='bottom' onHide={handleClose} className="offcanvassnav1">

                <Offcanvas.Body>
                    <div className='drop_dowwn'>
                        <h1 onClick={() => { setSortBy("createdAt"); setSortDis("desc"); handleClose(); setSortShow("New to Old") }}>Age: New to Old {sortBy == "createdAt" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}</h1>
                        <h1 onClick={() => { setSortBy("createdAt"); setSortDis("asc"); handleClose(); setSortShow("Old to New") }}>Age: Old to New {sortBy == "createdAt" && sortDis == "asc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}</h1>
                        <h1 onClick={() => { setSortBy("projectName"); setSortDis("asc"); handleClose(); setSortShow("Ascending") }}>Name: Ascending {sortBy == "projectName" && sortDis == "asc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}</h1>
                        <h1 onClick={() => { setSortBy("projectName"); setSortDis("desc"); handleClose(); setSortShow("Descending") }}>Name: Descending  {sortBy == "projectName" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}</h1>
                        <h1 onClick={() => { setSortBy("marketcap"); setSortDis("desc"); handleClose(); setSortShow("Market Cap") }}>Market Cap  {sortBy == "marketcap" && sortDis == "desc" && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11.6667 3.5L5.25004 9.91667L2.33337 7" stroke="#311E1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>}</h1>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default page