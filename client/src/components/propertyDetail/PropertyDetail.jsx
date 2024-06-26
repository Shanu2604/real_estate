import React from "react";
import classes from "./propertyDetail.module.css";
import person from "../../assets/person.jpg";
import emailjs from "@emailjs/browser";
import { useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { request } from "../../util/fetchAPI";
import { FaBed, FaSquareFull } from "react-icons/fa";
import { useRef } from "react";

const PropertyDetail = () => {
  const { user } = useSelector((state) => state.auth);
  const [propertyDetail, setPropertyDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  // todo display message
  const { id } = useParams();
  const formRef = useRef();

  const serviceId = process.env.REACT_APP_SERVICE_ID;
  const templateId = process.env.REACT_APP_TEMPLATE_ID;
  const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await request(`/property/find/${id}`, "GET");
        setPropertyDetail(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCloseForm = () => {
    setShowForm(false);
    setTitle("");
    setDesc("");
  };

  const handleContactOwner = async (e) => {
    e.preventDefault();

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey).then(
      (result) => {
        console.log(result);
        handleCloseForm();
      },
      (error) => {
        console.log(error.text);
      }
    );
  };

  return (
    <div className={classes.container}>
      <h3
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          fontSize: "32px",
          marginTop: "-2.5rem",
        }}
      >
        Property Details
      </h3>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img
            src={`https://real-estate-web-app-mdmo.onrender.com/images/${propertyDetail?.img}`}
          />
        </div>
        <div className={classes.right}>
          <h3 className={classes.title}>Title: {`${propertyDetail?.title}`}</h3>
          <div className={classes.details}>
            <div className={classes.typeAndContinent}>
              <div>
                Type: <span>{`${propertyDetail?.type}`}</span>
              </div>
              <div>
                Continent: <span>{`${propertyDetail?.continent}`}</span>
              </div>
            </div>
            <div className={classes.priceAndOwner}>
              <span className={classes.price}>
                <span>Price: $ </span>
                {`${propertyDetail?.price}`}
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                Owner:{" "}
                {propertyDetail?.currentOwner?.profileImg ? (
                  <img
                    src={`https://real-estate-web-app-mdmo.onrender.com/images/${propertyDetail?.currentOwner?.profileImg}`}
                    className={classes.owner}
                  />
                ) : (
                  <img src={person} className={classes.owner} />
                )}
              </span>
            </div>
            <div className={classes.moreDetails}>
              <span>
                {propertyDetail?.beds} <FaBed className={classes.icon} />
              </span>
              <span>
                {propertyDetail?.sqmeters} square meters{" "}
                <FaSquareFull className={classes.icon} />
              </span>
            </div>
          </div>
          <p className={classes.desc}>
            Description: <span>{`${propertyDetail?.desc}`}</span>
          </p>
          <button
            onClick={() => setShowForm(true)}
            className={classes.contactOwner}
          >
            Contact owner
          </button>
          {user?._id == null && (
            <Link to={`/signin`}>
              <h4 className={classes.noFuncMessage}>
                Sign in to get access to the functionality.
              </h4>
            </Link>
          )}
        </div>
      </div>
      {showForm && (
        <div className={classes.contactForm} onClick={handleCloseForm}>
          <div
            className={classes.contactFormWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Send Email To Owner</h2>
            <form onSubmit={handleContactOwner} ref={formRef}>
              <input
                value={user?.email}
                type="text"
                placeholder="My email"
                name="from_email"
              />
              <input
                value={user?.username}
                type="text"
                placeholder="My username"
                name="from_username"
              />
              <input
                value={propertyDetail?.currentOwner?.email}
                type="email"
                placeholder="Owner email"
                name="to_email"
              />
              <input type="text" placeholder="Title" name="from_title" />
              <input
                value={desc}
                type="text"
                placeholder="Desc"
                name="message"
                onChange={(e) => setDesc(e.target.value)}
              />
              <button>Send</button>
            </form>
            <AiOutlineClose
              onClick={handleCloseForm}
              className={classes.removeIcon}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
