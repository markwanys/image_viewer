import "module/myModules";

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var img = new Image();
var coordinatesDiv = document.getElementById('coordinates');
var imgX = 0; // Initial x-coordinate of the image
var imgY = 0; // Initial y-coordinate of the image
var isDragging = false;
var offsetX, offsetY;
const eye = n => [...Array(n)].map((e, i, a) => a.map(e => +!i--));

// Declaration
class Image_ {
            constructor(img) {
            this.img = img;
            this.affine_mat = eye(3);
            this.oldX = null;
            this.oldY = null;
            }
            reset() {
                this.affine_mat = eye(3);
            }
        };

const img_obj = new Image_(img)

// Event listener for file input change
document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            img.onload = function() {                
                // Draw the image onto the canvas at position (0, 0)
                ctx.drawImage(img, imgX, imgY);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Function to handle mouse down event
function handleMouseDown(e) {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    // Check if the mouse is pressed inside the image
    if (mouseX >= imgX && mouseX <= imgX + img.width && mouseY >= imgY && mouseY <= imgY + img.height) {
        isDragging = true;
        offsetX = mouseX - imgX;
        offsetY = mouseY - imgY;
    }
}

// Function to handle mouse move event
function handleMouseMove(e) {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    // Update coordinates in the div
    coordinatesDiv.textContent = 'Mouse X: ' + mouseX + ', Y: ' + mouseY + ' Client X: ' + e.clientX + ', Y: ' + e.clientY;
    img_obj.oldX = e.clientX;
    img_obj.oldY = e.clientY;
    // Check if the mouse has moved outside the canvas
    if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
        isDragging = false;
    }

    if (isDragging) {
        imgX = e.clientX - canvas.getBoundingClientRect().left - offsetX;
        imgY = e.clientY - canvas.getBoundingClientRect().top - offsetY;

        let mC = math.matrix([[1, 0, e.clientX - img_obj.oldX], [0, 1, e.clientY - img_obj.oldY], [0, 0, 1]]);
        // console.log(mC)
        ctx.transform(mC.get([0, 0]), mC.get([1, 0]), mC.get([0, 1]), mC.get([1, 1]), mC.get([0, 2]), mC.get([1, 2]));
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.drawImage(img, imgX, imgY);
    }
}

// Function to handle mouse up event
function handleMouseUp(e) {
    isDragging = false;
}

// Function to handle mouse wheel event
function handleMouseWheel(e) {
    e.preventDefault(); // Prevent default scrolling behavior

    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;

    let delta = e.deltaY; // Get the amount of scroll

    // Calculate the new scale factor based on the scroll direction
    let scaleFactor = 1 - delta * 0.001;
    
    // Define your transformation matrix
    let translate1 = math.matrix([[1, 0, -mouseX], [0, 1, -mouseY], [0, 0, 1]]);
    let scale = math.matrix([[scaleFactor, 0, 0], [0, scaleFactor, 0], [0, 0, 1]]);
    let translate2 = math.matrix([[1, 0, mouseX], [0, 1, mouseY], [0, 0, 1]]);

    // Apply the transformation matrix
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    // img_obj.affine_mat = math.multiply(translate2, scale, translate1, img_obj.affine_mat);
    affine_mat = math.multiply(translate2, scale, translate1);
    console.log(mouseX + ", " + mouseY)
    console.log(translate2)
    console.log(scale)
    console.log(translate1)
    console.log(affine_mat)

    // Apply the transformation matrix again
    // ctx.transform(img_obj.affine_mat.get([0, 0]), img_obj.affine_mat.get([1, 0]), img_obj.affine_mat.get([0, 1]), img_obj.affine_mat.get([1, 1]), img_obj.affine_mat.get([0, 2]), img_obj.affine_mat.get([1, 2]));
    ctx.transform(affine_mat.get([0, 0]), affine_mat.get([1, 0]), affine_mat.get([0, 1]), affine_mat.get([1, 1]), affine_mat.get([0, 2]), affine_mat.get([1, 2]));
    console.log(ctx.getTransform())

    ctx.save(); // Save the current transformation state
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation to identity matrix
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear the entire canvas
    ctx.restore(); // Restore the transformation state

    // Draw the image on the canvas with the applied transformation
    ctx.drawImage(img, 0, 0);   // Not coordinates in canvas
}

// Add event listener for mouse wheel event
canvas.addEventListener('wheel', handleMouseWheel);

// Add event listeners for mouse events
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', handleMouseMove);

// Change cursor to crosshair when inside canvas
canvas.addEventListener('mouseenter', function() {
    canvas.style.cursor = 'crosshair';
});

// Reset cursor to default when outside canvas
canvas.addEventListener('mouseleave', function() {
    canvas.style.cursor = 'default';
});



// EXPERIMENTAL

// var points = []

// // Add mouse click event listener
// canvas.addEventListener('click', function(event) {
//     // Check if shift key is pressed
//     if (event.shiftKey) {
//         var rect = canvas.getBoundingClientRect();
//         var mouseX = event.clientX - rect.left;
//         var mouseY = event.clientY - rect.top;

//         // Add the clicked point to the array
//         points.push({ x: mouseX, y: mouseY });

//         // // Clear the canvas and redraw the image
//         // ctx.clearRect(0, 0, canvas.width, canvas.height);
//         // ctx.drawImage(image, 0, 0);

//         // Draw the polygon with updated points
//         drawPolygon(ctx, points);
//     }
// });


// function drawPolygon(ctx, points) {
//     if (points.length < 2) return; // Need at least 2 points to draw a line

//     ctx.beginPath();
//     ctx.moveTo(points[0].x, points[0].y);
//     for (var i = 1; i < points.length; i++) {
//         ctx.lineTo(points[i].x, points[i].y);
//     }
//     ctx.closePath();
//     ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
//     ctx.fill();
// }