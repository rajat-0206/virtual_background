# RobustVideoMatting

A real-time virtual background application built with TensorFlow.js. This project uses a pre-trained deep learning model to perform video matting, allowing users to replace backgrounds in real-time video streams.

## Features

- **Real-time video processing**: Live webcam feed processing with background removal
- **Multiple background options**: 
  - Solid color backgrounds (white, green)
  - Custom image backgrounds
  - Alpha channel view
  - Foreground-only view
- **Recurrent state visualization**: View internal model states for debugging
- **High-quality matting**: Uses a robust video matting model for smooth results

## How It Works

The application uses a pre-trained TensorFlow.js model that performs video matting by:
1. Capturing frames from your webcam
2. Processing each frame through a neural network
3. Extracting foreground and alpha matte
4. Compositing the result with your chosen background
5. Displaying the result in real-time

## Prerequisites

- A modern web browser with WebRTC support
- Webcam access
- No additional software installation required

## Getting Started

1. **Clone or download** this repository to your local machine

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or serve the files using a local web server

3. **Grant camera permissions** when prompted by your browser

4. **Select your desired background** from the dropdown menu:
   - **Image backgrounds**: Various pre-loaded background images
   - **White/Green**: Solid color backgrounds
   - **Alpha**: View the alpha matte only
   - **Foreground**: View the extracted foreground only
   - **Recurrent states**: Debug views of internal model states

## Usage

- The video feed will automatically start when you load the page
- Use the dropdown menu to switch between different background options
- The canvas will display the processed result in real-time
- The model maintains temporal consistency across frames for smooth results

## File Structure

```
RobustVideoMatting/
├── index.html          # Main application file
├── model/              # TensorFlow.js model files
│   ├── model.json      # Model architecture
│   └── group1-shard1of1.bin  # Model weights
├── images/               # Background images
│   ├── image2.png
│   ├── image3.png
│   ├── image4.jpg
│   ├── image5.avif
│   ├── image6.jpg
│   └── image8.avif
```

## Technical Details

- **Framework**: TensorFlow.js 3.7.0
- **Model**: Pre-trained video matting model with recurrent states
- **Input**: 640x480 webcam feed
- **Processing**: Real-time inference with GPU acceleration (when available)
- **Output**: RGBA canvas with composited background

## Browser Compatibility

This application works best in modern browsers that support:
- WebRTC (for webcam access)
- WebGL (for GPU acceleration)
- ES6+ JavaScript features

Recommended browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- The application runs entirely in the browser using TensorFlow.js
- GPU acceleration is automatically used when available
- Processing speed depends on your device's capabilities
- The model uses a downsample ratio of 0.5 for optimal performance

## Credits

This project is based on the [RobustVideoMatting TensorFlow.js implementation](https://github.com/PeterL1n/RobustVideoMatting/tree/tfjs) by PeterL1n. The code and pre-trained model are sourced from the original repository.

