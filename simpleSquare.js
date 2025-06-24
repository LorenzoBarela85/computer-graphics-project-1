//
// simpleSquare.js
//
// Demonstration of a webgl program built with html and javascript.
// This program displays a square.
// Also needed: simpleSquare.html and the Common folder (and files)
//

// global variable for the drawing area and webgl context
var canvas;
var gl;

// initialize the object to not be rotated
var theta = 0.0;
var thetaLoc;
var offset;
var offsetLoc;
var numInstances = 10;
var radius = 0.75; // Radius of the circular arrangement
var offsets = [];

// direction is clockwise/counter-clockwise (latter is default)
var direction = false;

// control speed of rotation by changing increment of 
// theta rotation angle (in radians)
var deltaRadians = (( 2 * 3.149)/(8 * 60))/2.25;
//   units are radians/frame
// This setting results in 8 seconds for one rotation 
// Over [0, 2Pi] radians, we want 8sec * 60fps = 480 frames
// 2Pi / (8 * 60) 


// Value for speed up or slow down; change deltaRadians by this
//var speedIncrement = deltaRadians/2.0;

const radians2degrees = 90.0/3.14159;
var justOne = 0;
 
// When all the files have been read, the window system call the init function that holds our program
// This is an example of an event listener/handler
window.onload = function init()
{
	// document is refering to the document object model (DOM)
	// This allows us to communicate with the HTML web page
	// We are creating a short name for the canvas/drawing space
    canvas = document.getElementById( "gl-canvas" );
    
	// set up to use webgl in the canvas
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	
	// webgl functions start with "gl." indicating that they belong to the canvas
	
	// Define part of canvas to draw to using viewport
    // Lower-left in canvas is (0,0) 
	// and grab width and height from HTML document
    gl.viewport( 0, 0, canvas.width, canvas.height);
	// Try this: divide the width and height in half
	
	// background color of canvas
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	//  Load shaders (defined in GLSL code in HTML file)
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	// We will use these shaders from now on
    gl.useProgram( program );
    
	
	// This is the best way to debug -- print to the browser console (F12 to open)
	console.log("create vertices array");

	// sets the center points of each instance and saves it in an array offsets
	for (var i = 0; i < numInstances; i++) {
		var angle = (i / numInstances) * 2 * Math.PI;
		offsets.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
	}
	
	
	var vertices = [
		vec2(0, 1.0),         // (0, 4)    0
		vec2(-0.125, 0.75),   // (-0.5, 3) 1
		vec2(0.125, 0.75),    // (0.5, 3)  2 1st triangle
		
		vec2(-0.5, 0.75),      // (-2, 3)  3
		vec2(-0.625, 0.5),    // (-2.5, 2) 4
		vec2(-0.375, 0.5),    // (-1.5, 2) 5 2nd triangle
		
		vec2(-0.625, 0.5),    // (-2.5, 2) 4
		vec2(-0.375, 0.5),    // (-1.5, 2) 7
		vec2(-0.625, -0.25),  // (-2.5, -1)6 3rd triange
		
		vec2(-0.375, -0.25),   // (-1.5, -1)8 4th triangle
		vec2(-0.375, 0.5),    // (-1.5, 2) 7
		vec2(-0.625, -0.25),  // (-2.5, -1)6
		
		vec2(-0.125, 0.75),   // (-0.5, 3) 5th triangle
		vec2(0.125, 0.75),    // (0.5, 3)
		vec2(-0.125, -0.25),  // (-0.5, -1)
		
		vec2(0.125, 0.75),    // (0.5, 3) 6th triangle
		vec2(-0.125, -0.25),  // (-0.5, -1)
		vec2(0.125, -0.25),   // (0.5, -1)
		
		vec2(0.5, 0.25),      // (2, 1) 7th triangle
		vec2(0.375, 0.0),     // (1.5, 0)
		vec2(0.625, 0.0),     // (2.5, 0)
		
		vec2(0.375, 0.0),     // (1.5, 0) 8th triange
		vec2(0.625, 0.0),     // (2.5, 0)
		vec2(0.375, -0.5),    // (1.5, -2)

		vec2(0.625, 0.0),     // (2.5, 0) 9th triangle
		vec2(0.375, -0.5),    // (1.5, -2)
		vec2(0.625, -0.5),    // (2.5, -2)
		
		vec2(0.125, -0.25),   // (0.5, -1)10th triangle
		vec2(0.375, -0.25),   // (1.5, -1)
		vec2(0.125, -0.5),    // (0.5, -2)

		vec2(0.375, -0.25),   // (1.5, -1)11th triangle
		vec2(0.375, -0.5),    // (1.5, -2)
		vec2(0.125, -0.5),    // (0.5, -2)
		
		vec2(-0.625, -0.25),  // (-2.5, -1)12th triangle
		vec2(0.125, -0.25),   // (0.5, -1
		vec2(0.125, -0.5),   // (0.5, -2)
		
		vec2(-0.625, -0.25),  // (-2.5, -1) 13 triangle
		vec2(0.125, -0.5),    // (0.5, -2)
		vec2(-0.625, -0.5),   // (-2.5, -2)
		
		vec2(-0.125, -0.5),   // (-0.5, -2) 14th triangle
		vec2(0.125, -0.5),    // (0.5, -2)
		vec2(-0.125, -1.0),     // (-0.5, -4)

		vec2(0.125, -0.5),    // (0.5, -2)  15th triangle
		vec2(-0.125, -1.0),     // (-0.5, -4)
		vec2(0.125, -1.0),     // (0.5, -4)
		
	];
	
	var colors = [
		vec3(1.0, 0.0, 0.0), // Red
		vec3(0.0, 1.0, 0.0), // Green
		vec3(0.0, 0.0, 1.0), // Blue
		vec3(1.0, 1.0, 0.0), // Yellow
		vec3(1.0, 0.0, 1.0), // Magenta
		vec3(0.0, 1.0, 1.0), // Cyan
		vec3(1.0, 0.5, 0.0), // Orange
		vec3(0.5, 0.0, 1.0), // Purple
		vec3(0.5, 1.0, 0.0), // Olive
		vec3(0.0, 0.5, 1.0), // Sky Blue
		vec3(1.0, 0.0, 0.5), // Pink
		vec3(0.5, 1.0, 1.0), // Light Cyan
		vec3(1.0, 0.5, 1.0), // Light Magenta
		vec3(0.25, 0.75, 0.75), // Teal
		vec3(0.9, 0.7, 0.7)  // Peach
	];
	var colorData = [];
	for (var i = 0; i < colors.length; i++) {
    colorData.push(colors[i], colors[i], colors[i]); // Assign the same color to each triangle's vertices
	}
    

	// Here is an example of how to debug with print statements
	// Hit F12 in the browser to open the debug window
	console.log("vertices = ",vertices);
	console.log("vertex[0] = ",vertices[0]);
	console.log("vertex[0][0] = ",vertices[0][0]);
	console.log("vertex[0][1] = ",vertices[0][1]);

    
    // Load the data into the GPU
	// Create memory (buffer) to hold data -- here vertices
	// Bindbuffer identifies that "bufferId" is vertex information
	// Takes 2d vertices and flattens them into a 1d array
	// gl.STATIC_DRAW is an example of a webgl constant
	//    It means we intend to specify data once here and use repeatedly for webgl drawing
	//
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
	// Note that in the vertex shader, the vertex is called vPosition.
	// The var here is the same name to keep the association simple, but it is not necessary
	// 2d points being loaded
	//
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colorData), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);
 
	// associate shader theta variable    
    thetaLoc = gl.getUniformLocation( program, "theta" );
	//offset = gl.getUniformLocation(program, "offset");
// associate shader offsetLoc variable
	offsetLoc = gl.getUniformLocation(program, "offset");
    justOne = 0;
	render();
	
    /* this is a little play to demo double buffering that occurs when call render -- revisit after doublebuffer ppt */
	/*
	console.log("displayed initially -- wait  and do again")
	setTimeout(function(){render();}, 5000);
	console.log("did it");
	*/
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the center instance
    gl.uniform2fv(offsetLoc, flatten(vec2(0.0, 0.0))); // Center at (0,0)
    gl.uniform1f(thetaLoc, theta); // Keep it rotating
    gl.drawArrays( gl.TRIANGLES, 0, 48); // draws prototype in center

    // Draw the 10 instances in a circle
    for (var i = 0; i < numInstances; i++) {
        var angle = (i / numInstances) * 2 * Math.PI + theta; // Rotate instances dynamically
        angle = -angle;
		var offset = vec2(radius * Math.cos(angle), radius * Math.sin(angle));

        gl.uniform2fv(offsetLoc, flatten(offset)); // Update position
        gl.uniform1f(thetaLoc, -theta); // Update rotation

        gl.drawArrays( gl.TRIANGLES, 0, 48); // Prints each instance prototype 
    }

    theta += (direction ? deltaRadians : -deltaRadians); //Update the rotation angle (theta)

    requestAnimationFrame(render);
}
