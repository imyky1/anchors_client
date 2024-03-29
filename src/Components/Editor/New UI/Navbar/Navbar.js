import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./Navbar.css";
import mixpanel from "mixpanel-browser";
import { useNavigate } from "react-router-dom";
import { siteControlContext } from "../../../../Context/SiteControlsState";

function Navbar({ ChangeModalState, ModalState, userData, alternateInfo }) {
  const navigate = useNavigate();
  const { shortSidebar } = useContext(siteControlContext);

  // handles the openeing of the creator modal
  const handleModalOpening = (e) => {
    e?.stopPropagation();
    mixpanel.track("Header Profile ");
    ModalState ? ChangeModalState(false) : ChangeModalState(true);
  };

  const generateMailtoLink = () => {
    const recipient = "info@anchors.in";
    const subject = "";
    const body = "";

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    return mailtoLink;
  };

  if(shortSidebar){
    return null;
  }

  return (
    <div className="navbar_outside_container">
    {window.screen.width < 600 && <img
      onClick={() => {
        navigate("/");
        mixpanel.track("header logo");
      }}
      src={require("../../../../Utils/Images/logo-invite-only.png")}
      alt=""
      className="logo_sidebar"
    />}

      <LazyLoadImage
        effect="blur"
        onClick={handleModalOpening}
        className="creators_navbar_image"
        src={
          alternateInfo?.profile
            ? alternateInfo?.profile
            : userData?.photo
            ? userData?.photo
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHaAfOzOEovz1u7rsIMbl_SzAAxk99xlyxAVJ4r3475UvmyHLFVZSZkaGSbLFc5PNRO3A&usqp=CAU"
        }
        alt=""
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAYAAADh5qNwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAmDSURBVHgBzVoJeFTVFT7nvjeZQIpEBCUBywRZDB+FEMImJUwQiGChUKwtlaW1FimLyKJsnxiRJbIoCFIqtlSWr35QvxjyASUFkrCZkEBCCg02kEzYN4UCJpnMe/f0vIxhiQmZ92YQ/u87M/Pevefec+69Z7n3DkIA4UgqDhX1GsToiPEA2AoFtCRJTQCxEQAFcRWN6TKXuQBkBRDmIMEuKLue6RoacQ0CBAQ/YSgC9R4ZzUIP4UcnWEcakFxHISE7SmJDzoMfsKzUUzsuPC5JnQSSxnEroRAgEFEpCtxIZdoC19AwF1iAaaWMmVFsIdMkwgxmVuA+gQB0BPpELy97p2SYw9TMmVIqIuXyIAR9DbM9AT8UkFxI9PbJQWHrfGbxpVKrDwvt0tEgkUfudXhAIKSFRYPCZ/lSt06l2iafCtfJlsTNdoUHDaIj0gODi15sdupe1e6pVMTn51qoAnZzYy3h4YFLI3QWDwsvqa1CrUq13HT2x4oi0/lnBDxk4NhWrKDes6AWByJqY1RRJqOECCZ42IhdY4QulS8MW69R9ppettl8Zj5KPQr8BUIaEaagKvLIU/ENomiEQkRzLOrPgvUH/9BVecKeyN+Tv99tNbT5rGSUAPoU/AHiUdT08QUvtdxjPLbbVNxU19THha5fLhjpXTKRn7miORZt5p/+2Svi4OO/apFy16s7HyLXu8JIoQP80wHWkQHBtmHHf9H868iNJydLgcORsMsd5f+Wklb8d0TLNY61R5vag+tvqVZuFhfK3RDp+t3t3PFupTYUfcxv/gDW4bJXYKcbih4UJHA7j2J0rTWJsnQR/LP67grNbYcD/BwJ1jGPV8VbVQ+3lHp6bYED1aAT/qQ+AkTc0RGOjHYbirL40YfRp4x6kdf6fVvQsCfzpoF1SJUoLH9Uq0teOb6DItTZQkoFpQQrBFIWHh0Zkd5ufeFofu7iGx/1dv+n0ajjI1unM/8xq30zCY1g0u3BZXT6y/FwLhjOSwCsEudnn1Q2qOMkU7xS/6PBhyDW+9e/HBe1Njf0llJuqHSxITxyYJWEpp8xMjTuoJ0pXq7vTEhThVZ20Z/+mUI1CBlt6KN6NcNRRoE/IFLKu2040aC0XAaZ5Kx3/smwejYprmNlZPVLCmOjulwYUyYkxaF3CflBFY9kvdTqBqcw10zxSXnzq98/fUMhd4j/MpDTq4/b1h2MWfKXCNuyCye2kXwzfMyR751p/Ekg5NDL7DGchOOzJP2ddsPQ8RX+mqmQOleSZ6evfGyFiZX8En/JUoG/EALjBZGMCcC0G96ncceP8l/NHdt2F0u62hce7nxF/tj2KVErj77C/I5AyAGkt8ZOK/ONtKgHBAAcuE8TqL1yJ7Qrifoo/31eWpNrry3/3PBKxwnXGuY1R1U5wMxhEBBgvmDtWgTEpph4GTcXoP3aaDpvfIcp/PZ5trF/sGctrbQfSexIZBLoWt/cCVFj0xNQY9f7WzaosEDJwEG8MUYvz61gGWzgLxC32gDHZr3W8UxUAgfBhrozb3Ln5MotXTU4EoqDH33sahxp+GXe5E7Xoj7IdaACi7nmC+A/3Nj5g8OGdfpxqInfciY+LXdS1GoWLlQBmsIvJzKFsjYujsb7SUIGu0XeT6mPsY7R3NnPubwp02kO+pt0dK/Mm9zD1fn9w1N55ubyu/pgHYTcUDl3bLfGDprQsMfB6dE5MUuzB/JscaqEpm2DPadLB3rt8JTOKTFLcvuBkFvB+uqpEBz8vrG4fvkDhxkKdVmSM4fHZyt7ZEu2wbbo4ARgS+elh6fnTOv0L94Zx/N7zaJcVwR/XLaWa8mEnKnRW2IWZY/nNt7xM2/z5o+6nthl0cEZh6bGpJEuZ1iUqwS7JWYn8UHhEFMTzOdvB2d0i+q2+FAHktoRv0yyOtCINhQtG4pjylW5n5s2tSvmuJuucrA6ydtpM3zAjmGqkVmXalqSl5MgcKgUZj2cP9eNghq/IVBJN8ONCDlC1+if4N3k+UTsVAqzp3fdVW4LHsFT3dIMr899SNk+KKjx8OxZz2Twi0wzvEKXO3kbVJ5jJg3hdb/MO100JTDpVc1EOk41uhGatsEMn93jzqpcPT3e3ccXXuj0ZXolam34ksUmhHIM7jME2NorbrjusXtO+VKfhyItc85P+3jPKKT4wqdzCJKFWW/1LlQQB/hxnuAz6Vp5/z3zu55mr+bypb6QuM47GAw7uT/1bu68SU1tJCScNeqjTkF11Q0E8bbIm1kYbrru+jcVm77jllLpCXF8EIirfDDEqO4z0hz758Yu5PW75n44iSrigPzxgbm9Fhj9scCOOp0L0d/3zo49f0spA5qn/EOeZr0OQwxVFEwzOto3N3aMIBzHRnkpwE7COA54+cC7vV91vp3ZTFUxlTP7FvfkYbk1oS+4bYvfIWtB34s8Ou/VGfWJHDY++I+dkdFn77zYP+lS4wN/nOld9wRWiaPmVzwj0xsowS32zXOu7Tl91wDdU/Yll7X24URqTWZCnKtKl7uiLgfUUOmWBexGmoIP4IlfzxuiOZmJ3gads9LaS5AvcEEHQj6zkBCJNUR2LivlPoq5hRwEpcAtyzZmLRp4xijrNXN3TxbSuAYdCD4BXVRe8czeZc+dr1EpAz3fTB2soEgGMyBM41Trr4T2rfsSe12teu10JqiyZ1wYkedRHlHFg7JMLaP/NT17/dLmzS/qVfX6vZka7gE0XgxBxN5gBlKM3rO4z12X3DXmR7Fv7FzGmcMksABe4oc4VTnI+6dz/PuEFHRR1emmTlhBpNtUoTYhVMK5PJw7b8ZK9GW2p8AKBC7IeK/v7Oqva1RqwMRt9tJgdQ+fLT74y+taQUfSl8bXeDFY4/Xo9hUD3VpZ2VA23KIAe7aAEKPY4xGDoRbcMz13vr7dwVeafDsvH5rLbHYyxULocbuXPm/+dr4K/afseFLTZTIbSyd4wCCBB4MgZMiOZbH3/FuPzxupZydum8/N+vSPk/sChOVBhNMN06i7qgn0nbhtFBlbdyAH/EBgC7qgkBiTumpgiq88pvfhznFbm6pSmwsoXmbu+/YvMmNLIKRYWBHsWZK+bKipPzhaPlx4bmySQwN1Fnuj33ArIRAo8G6B21uFYF+eujr+EliA3ycm8WM+D5NCxKMUo1iiOLAITqbS+WgsWasPfzM7M9URwGMgIwQkhSo3qLuiiD78GMOjbgdj24DUhL9Vzh44q4CvudcrTEWCMw4PyVT9R5jtryJ34v+Gs0/QI4bwvgAAAABJRU5ErkJggg==";
        }}
      />

      {/* <span onClick={()=>{mixpanel.track("Playbook");window.open("https://go.anchors.in/anchors-guide")}}>Book</span> */}

      {/* <span onClick={()=>{mixpanel.track("Connect with Us");window.open(generateMailtoLink())}}>Connect with us</span> */}

      {window.screen.width > 600 && (
        <>
          <span
            className="fancy_navbar_link01"
            onClick={() => {
              mixpanel.track("Guide");
              window.open("https://go.anchors.in/anchors-guide", "_blank");
            }}
          >
            Guide
          </span>

          <span
            className="fancy_navbar_link01"
            onClick={() => {
              mixpanel.track("Host your event");
              window.open("https://www.anchors.in/hostevent", "_blank");
            }}
          >
            Host Event
          </span>
        </>
      )}
    </div>
  );
}

export default Navbar;
