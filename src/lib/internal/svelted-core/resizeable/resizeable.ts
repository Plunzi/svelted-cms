  /*Make resizable div by Hung Nguyen*/
  export const makeResizableDiv = function (div: string) {
    const element = document.querySelector(div) as HTMLElement;
    const resizers = document.querySelectorAll(".resize-item") as NodeListOf<HTMLElement>;
    const minimum_size: number = 344;
    let original_width: number = 0;
    let original_height: number = 0;
    let original_x: number = 0;
    let original_y: number = 0;
    let original_mouse_x: number = 0;
    let original_mouse_y: number = 0;

  for (let i = 0; i < resizers.length; i++) {
    const currentResizer: HTMLElement = resizers[i];
    currentResizer.addEventListener("mousedown", function (e: MouseEvent) {
      e.preventDefault();
      original_width = parseFloat(getComputedStyle(element).getPropertyValue("width").replace("px", ""));
      original_height = parseFloat(getComputedStyle(element).getPropertyValue("height").replace("px", ""));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    });

      function resizeBottom(e: MouseEvent) {
        const height = original_height + (e.pageY - original_mouse_y);
        if (height > minimum_size) {
          element.style.height = height + "px";
        }
      }

      function resizeLeft(e: MouseEvent) {
        const width = original_width - (e.pageX - original_mouse_x)*2;

        if (width > minimum_size) {
          element.style.width = width + "px";
          // element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
        }
      }

      function resizeRight(e: MouseEvent) {
        const width = original_width + (e.pageX - original_mouse_x)*2;
        if (width > minimum_size) {
          element.style.width = width + "px";
        }
      }

      function resize(e: MouseEvent) {
        // switch (currentResizer.classList[1]) {
          switch (currentResizer.id) {
          case "resize-left":
            resizeLeft(e);
            break;
          case "resize-right":
            resizeRight(e);
            break;
          case "resize-bottom":
            resizeBottom(e);
            break;
          default:
            break;
        }
      }

      function stopResize() {
        window.removeEventListener("mousemove", resize);
      }
    }
  }

//   export function dragElement(elmnt) {
//     let pos1 = 0,
//       pos2 = 0,
//       pos3 = 0,
//       pos4 = 0;

//     if (document.getElementById(elmnt.id + "-header")) {
//       document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
//     } else {
//       elmnt.onmousedown = dragMouseDown;
//     }

//     function dragMouseDown(e) {
//       e = e || window.event;
//       e.preventDefault();
//       // get the mouse cursor position at startup:

//       pos3 = e.clientX;
//       pos4 = e.clientY;

//       document.onmouseup = closeDragElement;
//       // call a function whenever the cursor moves:
//       document.onmousemove = elementDrag;
//     }

//     function elementDrag(e) {
//       e = e || window.event;
//       e.preventDefault();
//       // calculate the new cursor position:
//       pos1 = pos3 - e.clientX;
//       pos2 = pos4 - e.clientY;
//       pos3 = e.clientX;
//       pos4 = e.clientY;
//       // set the element's new position:
//       if (elmnt.offsetTop - pos2 >= 0) {
//         elmnt.style.top = elmnt.offsetTop - pos2 + "px";
//       }
//       if (elmnt.offsetLeft - pos1 >= 0) {
//         elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
//       }
//     }

//     function closeDragElement() {
//       /* stop moving when mouse button is released:*/
//       document.onmouseup = null;
//       document.onmousemove = null;
//     }
//   }