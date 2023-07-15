// import { PNGStream } from "canvas";
import React, { Component } from "react";
import DEFAULTLOGO from "../Images and svgs/android-chrome-192x192.png";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.image = React.createRef();
    this.imageback = React.createRef();
    console.log(this.props)
  }

  async componentDidMount() {
    function gradient(color0, color2, canvas) {
      let fillColor = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      fillColor.addColorStop(0, color0); //starting corner
      fillColor.addColorStop(1, color2); //ending Corner
      ctx.fillStyle = fillColor;
    }

    const wrapText = async (ctx, text, x, y, maxWidth, lineHeight) => {
      // First, start by splitting all of our text into words, but splitting it into an array split by spaces
      let words = text.split(" ");
      let line = ""; // This will store the text of the current line
      let testLine = ""; // This will store the text when we add a word, to test if it's too long
      let lineArray = []; // This is an array of lines, which the function will return

      // Lets iterate over each word
      for (var n = 0; n < words.length; n++) {
        // Create a test line, and measure it..
        testLine += `${words[n]} `;
        let metrics = await ctx.measureText(testLine);
        let testWidth = metrics.width;
        // If the width of this test line is more than the max width
        if (testWidth > maxWidth && n > 0) {
          // Then the line is finished, push the current line into "lineArray"
          lineArray.push([line, x, y]);
          // Increase the line height, so a new line is started
          y += lineHeight;
          // Update line and test line to use this word as the first word on the next line
          line = `${words[n]} `;
          testLine = `${words[n]} `;
        } else {
          // If the test line is still less than the max width, then add the word to the current line
          line += `${words[n]} `;
        }
        // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
        if (n === words.length - 1) {
          lineArray.push([line, x, y]);
        }
      }
      // Return the line array
      return lineArray;
    };
    const ctx = this.canvas.current.getContext("2d");
    ctx.font = "600 60px Roboto";
    var colors = [
      "#a18cd1",
      "#fbc2eb",
      "#ff8177",
      "#b12a5b",
      "#84fab0",
      "#8fd3f4",
      "#a1c4fd",
      "#c2e9fb",
    ];
    //chose a number between 0 and 7
    var randomNumber;
    //chose a number between 0 and 7
    if (sessionStorage.getItem("gradColor")) {
      if (sessionStorage.getItem("gradColor") !== undefined) {
        randomNumber = parseInt(sessionStorage.getItem("gradColor"));
      } else {
        randomNumber = Math.floor(Math.random() * colors.length);
        sessionStorage.setItem("gradColor", randomNumber);
      }
    } else {
      randomNumber = Math.floor(Math.random() * colors.length);
      sessionStorage.setItem("gradColor", randomNumber);
    }
    var randomNumber2;
    //when the 2 random Numbers equal the same it creates another randomNumber2
    if (randomNumber < 7) {
      if (randomNumber === 0) {
        randomNumber2 = randomNumber + 1;
      }
      if (randomNumber % 2 !== 0) {
        randomNumber2 = randomNumber - 1;
      } else {
        randomNumber2 = randomNumber + 1;
      }
    } else if (randomNumber === 7) {
      randomNumber2 = randomNumber - 1;
    }
    //diagonal
    gradient(colors[randomNumber], colors[randomNumber2], this.canvas.current);
    ctx.fillRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    ctx.font = "600 35px Roboto";
    ctx.strokeStyle = "#fff";
    await ctx.roundRect(60, 350, 410, 65, 50);
    await ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#000";

    let creator_name = `By - ${this.props.creator_name}`;
    let wrappedTextName = await wrapText(ctx, creator_name, 105, 395, 340, 50);
    wrappedTextName.forEach(async (item, i) => {
      if (i > 0) {
        return;
      }
      await ctx.fillText(item[0], item[1], item[2]);
    });
    let lenghte = this.props.textToShow.length;
    //ctx.fillText(this.props.textToShow, 10, 100);
    let texttowrite = this.props.textToShow;
    let word_array = texttowrite.split(" ");
    let final_words;
    ctx.font = "600 60px Roboto";

    if (word_array.length <= 10) {
      final_words = word_array.splice(0, word_array.length);
    } else {
      final_words = word_array.splice(0, 10);
      final_words.push("...");
    }

    let final_words_line = final_words.join(" ");
    lenghte = final_words_line.length;
    ctx.fillStyle = "#fff";
    let wrappedText = await wrapText(ctx, final_words_line, 50, 190, 720, 85);
    let assumed_lenght = wrappedText.length;
    wrappedText.forEach(async (item, i) => {
      if (i > 1) {
        return;
      }
      if (i === 1 && assumed_lenght > 2) {
        item[0] = item[0].concat("...");
      }
      await ctx.fillText(item[0], item[1], item[2]);
    });
    try {
      const img2 = new Image();
      img2.crossOrigin = "anonymous";
      img2.src = `${this.props.imgBackground}`;
      await img2.decode();
      ctx.beginPath();
      ctx.arc(1100, 310, 270, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img2, 800, 35, 500, 500);
      ctx.closePath();
    } catch (error) {
      console.log(error);
      try {
        const img2 = new Image();
        img2.crossOrigin = "anonymous";
        img2.src = DEFAULTLOGO;
        await img2.decode();
        ctx.beginPath();
        ctx.arc(1100, 310, 270, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img2, 890, 170, 200, 200);
        ctx.closePath();
      } catch (error) {
        console.log(error);
      }
    }

    let canvasImage = this.canvas.current.toDataURL("image/png");
    sessionStorage.setItem("canvas", canvasImage);
    this.props.setURL(canvasImage);
  }

  render() {
    const { width, height, imgBackground } = this.props;

    const downloadCanvasAsImage = () => {
      let canvasImage = this.canvas.current.toDataURL("image/png");

      // this can be used to download any image from webpage to local disk
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = function () {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = "image_name.png";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open("GET", canvasImage); // This is to download the canvas Image
      xhr.send();
    };
    return (
      <>
        <div className="canvas_image">
          {/**style={{ display: "none" }} */}
          <img
            crossOrigin="anonymous"
            src={imgBackground}
            alt=""
            ref={this.image}
          />
        </div>
        <div>
          <canvas
            crossOrigin="anonymous"
            ref={this.canvas}
            width={width}
            height={height}
          />
        </div>
        <button onClick={() => downloadCanvasAsImage()}>
          Download the image!!
        </button>
      </>
    );
  }
}
export default Canvas;

