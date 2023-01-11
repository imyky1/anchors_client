import { PNGStream } from "canvas";
import backgroundimg from "./backgroundimg.png";
import React, { Component } from "react";

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.image = React.createRef();
    this.imageback = React.createRef();
  }

  componentDidMount() {
    const ctx = this.canvas.current.getContext("2d");
    const img = this.image.current;
    const backimg = this.imageback.current;

    backimg.onload = async () => {
      await ctx.drawImage(backimg, 0, 0);
    };
    img.onload = async () => {
      ctx.font = "600 40px Courier";
      ctx.fillStyle = "White";
      let lenghte = this.props.textToShow.length;
      //ctx.fillText(this.props.textToShow, 10, 100);
      let texttowrite = this.props.textToShow;
      if (lenghte >= 109) {
        texttowrite = texttowrite.slice(0, 108);
      }
      let wrappedText = await wrapText(
        ctx,
        texttowrite,
        60,
        lenghte <= 27 ? 200 : lenghte <= 54 ? 170 : lenghte <= 81 ? 160 : 135,
        700,
        50
      );
      wrappedText.forEach(async (item) => {
        await ctx.fillText(item[0], item[1], item[2]);
      });
      await ctx.beginPath();
      await ctx.arc(950, 200, 130, 0, 2 * Math.PI);
      await ctx.closePath();
      await ctx.clip();
      await ctx.drawImage(img, 817, 70, 270, 270);
      await ctx.restore();
    };

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
  }

  render() {
    console.log(this.imageback.current);
    const { textToShow, width, height, imgBackground, imgback } = this.props;
    console.log(textToShow.length);

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
        <div className="canvas_image" style={{ display: "none" }}>
          <img
            crossorigin="anonymous"
            src={imgBackground}
            alt=""
            ref={this.image}
          />
          <img
            crossorigin="anonymous"
            src={backgroundimg}
            alt=""
            ref={this.imageback}
          />
        </div>
        <div>
          <h3>Image with title</h3>
          <canvas
            crossorigin="anonymous"
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

// const Canvas = ({ textToShow, width, height, imgBackground }) => {
//   const img = useRef();
//   const canvas = useRef();

//   useEffect(() => {
//     console.log("run", canvas, img);
//     const ctx = canvas.current.getContext("2d");
//     img.onload = () => {
//       ctx.drawImage(img, 0, 0);
//       ctx.font = "40px Courier";
//       ctx.fillStyle = "black";
//       ctx.fillText(textToShow, 10, 180);
//     };
//   }, [textToShow, img, canvas]);

//   console.log(canvas);
//   return (
//     <>
//       <div className="canvas_image">
//         <h3>Original Image</h3>
//         <img src={imgBackground} alt="" ref={img} />
//       </div>
//       <div>
//         <h3>Canvas Image</h3>
//         <canvas ref={canvas} width={width} height={height} />
//       </div>
//     </>
//   );
// };

// export default Canvas;
