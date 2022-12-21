import React, { useContext, useEffect, useState } from "react";
import SubscriberDetail from "../Subscriber Details/Subscriber_detail";
import { creatorContext } from "../../Context/CreatorState";
import "./Subscribers.css";
import { LoadTwo } from "../Modals/Loading";
import { SuperSEO } from "react-super-seo";

function Subscribers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(0);
  const [filtering, setFiltering] = useState(false);
  const [goto, setGoto] = useState(1);
  const [openLoading, setOpenLoading] = useState(false);
  const [filterOpen, setfilterOpen] = useState(false);
  const [queryData, setQueryData] = useState([]);
  const [normalSubs, setNormalSubs] = useState([]);
  const items = 50; // limit of items

  const [query, setQuery] = useState("");
  const { allSubscribers, getAllSubscribers, paging } =
    useContext(creatorContext);

  const process = async () => {
    const data = await getAllSubscribers();
    //if (data?.res?.length !== 0) {
      //const data2 = getSubsInfo(data);
      return data;
    //}
  };

  const pagination = async (data, sentby = "", value) => {
    if (sentby === "nxt") {
      let data2 = data?.slice(currentPage * items, currentPage * items + items); // slices the data on next click
      setNormalSubs(data2);
    } else if (sentby === "pre") {
      let data2 = data?.slice(
        (currentPage - 2) * items,
        (currentPage - 2) * items + items
      ); // slices the data on previous click
      setNormalSubs(data2);
    } else if (sentby === "goto") {
      let data2 = data?.slice((value - 1) * items, (value - 1) * items + items); // slices the data on previous click
      setNormalSubs(data2);
    } else {
      let data2 = data?.slice(
        (currentPage - 1) * items,
        (currentPage - 1) * items + items
      ); // slices the data on normal click
      setNormalSubs(data2);
    }
  };

  const searching = async(data) =>{
    setCurrentPage(1)
    if(query === ""){
      setFiltering(false)
      setSearchResults(0)
      return;
    }
    setFiltering(true)
    const filter = document.querySelectorAll(".filter_list")
    if(filter[0]?.children[0].className === "item_active"){
      let data2 = data?.filter(e=>e?.userID?.location?.city?.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(data2.length)
      setQueryData(data2)
    }
    else if(filter[0]?.children[1].className === "item_active"){
      let data2 = data?.filter(e=>e?.userID?.location?.country?.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(data2.length)
      setQueryData(data2)
    }
    else{
      let data2 = data?.filter((e)=>e?.userID?.name?.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(data2.length)
      setQueryData(data2) 
    }
  }

  const searchKeyDown = (e) =>{
    if(e.key === "Enter"){
      searching(allSubscribers)
    }
  }

  //  event listener on goto
  const doc = document.querySelector(".gotoInput");
    doc?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        setOpenLoading(true);
        if (
          goto < 1 || goto > (paging.totalItems % items === 0 ? paging.totalItems / items: parseInt(paging.totalItems / items) + 1)
        ) {
          setCurrentPage(1)
          pagination(allSubscribers, "goto", 1);
          setOpenLoading(false);
        }
        else{
          setCurrentPage(goto);
          pagination(allSubscribers, "goto", goto).then(() => {
            setInterval(() => {
              setOpenLoading(false);
            }, 1500);
          });
        }
      }
    });

  const handlegotopage = (e) => {
    setGoto(e.target.value);
  };



  useEffect(() => {
    setOpenLoading(true);
    process().then((e) => {
      pagination(e).then(() => {
        setInterval(() => {
          setOpenLoading(false);
        }, 1000);
      });
    });
    // eslint-disable-next-line
  }, []);

  // filter clicks and handling

  const handleFilter = () => {
    const doc = document.querySelector(".filter_list");
    const doc2 = document.querySelector(".filter_icon");
    if (!filterOpen) {
      doc.style.display = "flex"
      doc2.style.border = "2px solid grey";
      doc2.style.color = "grey";
      setfilterOpen(true);
    } else {
      doc.style.display = "none"
      doc2.style.border = "2px solid blue";
      doc2.style.color = "blue";
      setfilterOpen(false);
    }
    
  };

  //const filter = document.querySelectorAll(".filter_list");
  //  document.addEventListener("click",(e)=>{
  //    if(e !== filter) {
  //      setfilterOpen(false)
  //    }
  //  })

  const handleFilterClick = (e) => {
    const doc = document.querySelectorAll(".filter_list");
    doc[0].children[0].className = "";
    doc[0].children[1].className = "";
    doc[0].children[2].className = "";

    if (e.target.innerText === "Filter by country") {
      e.target.className = "item_active";
    } else if (e.target.innerText === "Filter by name") {
      e.target.className = "item_active";
    } else {
      e.target.className = "item_active";
    }
  };

  const prevPage = async () => {
    setCurrentPage(currentPage - 1);
    setOpenLoading(true);
    if (currentPage === 1) {
      return;
    }
    pagination(allSubscribers, "pre").then(() => {
      setInterval(() => {
        setOpenLoading(false);
      }, 1000);
    });
  };
  const nxtPage = async () => {
    setCurrentPage(currentPage + 1);
    setOpenLoading(true);
    pagination(allSubscribers, "nxt").then(() => {
      setInterval(() => {
        setOpenLoading(false);
      }, 1000);
    });
  };

  return (
    <>
      <div className="subscriber_list_page">
        <h2>Subscriber List ( an user who used your services )</h2>
        <div className="subs_count_box">
          <div className="subs_box">
            <span>{paging.totalItems}</span>
            <span>Total Subscriber</span>
          </div>
          <div className="subs_box">
            <span>{paging.paid}</span>
            <span>Paid Subscriber</span>
          </div>
          <div className="subs_box">
            <span>{paging.free}</span>
            <span>Free Subscriber</span>
          </div>
        </div>

        {/* Showing search results */}
        {filtering && 
          <div className="searchresults">
            <h3>Search Results : {searchResults}</h3>
          </div>}

        <div className="search_bars">
        <div>
        <input type="text" className="search_box" placeholder="Search..." value={query} onChange = {(e)=>{setQuery(e.target.value)}} onKeyDown={searchKeyDown}/>
        <i className="fa-solid fa-magnifying-glass fa-lg" onClick={()=>{searching(allSubscribers)}}></i>
        </div>
        <span className=" filter_icon" onClick={handleFilter}>
        <i className="fa-solid fa-arrow-down-a-z fa-xl"></i>
        </span>
       
        <ul className="filter_list">
          <li className="item_active" onClick={handleFilterClick}>Filter by city</li>
          <li onClick={handleFilterClick}>Filter by country</li>
          <li onClick={handleFilterClick}>Filter by name</li>
        </ul>
      </div>

        <div className="sub_table_head">
          <span>S.No.</span>
          <span>Name</span>
          <span>Email ID</span>
          <span>Location</span>
          <span>Type</span>
        </div>
      </div>

      {openLoading && <LoadTwo open={openLoading} />}
      <div className="subs_details">
        {allSubscribers.length !== 0 &&
          (filtering ? queryData : normalSubs)?.map((info, id) => {
            return (
              <SubscriberDetail
                key={id}
                sno={
                  currentPage !== 1
                    ? id + 1 + (currentPage - 1) * items
                    : id + 1
                }
                info={info}
                type={info?.isPaid ? "Paid" : "Free"}
              />
            );
          })}
        {/* PAGINATION DIV */}
        {!openLoading && !filtering &&
          (allSubscribers.length !== 0 ? (
            <div className="pagination_div">
              <button
                className="clickable"
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outlined"
              >
                {"<"} Previous Page
              </button>

              <button
                variant="contained"
                disabled
                style={{ fontWeight: "800" }}
              >
                {currentPage}
                <span>
                  /
                  {paging.totalItems % items === 0
                    ? paging.totalItems / items
                    : parseInt(paging.totalItems / items) + 1}
                </span>
              </button>
              <input
                  type="number"
                  className="gotoInput"
                  placeholder="Go To"
                  onChange={handlegotopage}
                />

              <button
                className="clickable"
                onClick={nxtPage}
                disabled={currentPage === (paging?.totalItems % items === 0 ? paging?.totalItems / items: parseInt(paging?.totalItems / items) + 1)}
                variant="outlined"
              >
                Next Page {">"}
              </button>
            </div>
          ) : (
            <h1 className="no_services">No subscribers to display</h1>
          ))}
      </div>
      <SuperSEO
        title="Anchors - Subscribers"
      />
    </>
  );
}

export default Subscribers;
