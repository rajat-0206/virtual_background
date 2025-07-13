# Robust Video Matting - AI Background Replacement

A real-time AI-powered video background replacement tool built with TensorFlow.js and Robust Video Matting technology. This web application allows users to replace video backgrounds in real-time using their webcam.

## 🌟 Features

- **Real-time Background Replacement**: Instant AI-powered background removal and replacement
- **Custom Color Backgrounds**: Choose any color for your background
- **Virtual Backgrounds**: 6 pre-loaded virtual background options
- **Custom Image Upload**: Add your own background images via URL
- **Professional UI**: Clean, modern interface with smooth animations
- **Cross-platform**: Works on any device with a webcam and modern browser

## 🚀 Live Demo

Visit the live demo: [Robust Video Matting Demo](https://rajat-0206.github.io/virtual_background/)

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Framework**: TensorFlow.js 3.7.0
- **AI Model**: Robust Video Matting
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
virtual_background/
├── index.html          # Main application file
├── script.js           # JavaScript logic and AI processing
├── model/              # AI model files
│   ├── model.json      # Model configuration
│   └── group1-shard1of1.bin  # Model weights
├── images/             # Virtual background images
│   ├── image2.png
│   ├── image3.png
│   ├── image4.jpg
│   ├── image5.avif
│   ├── image6.jpg
│   └── image8.avif
└── README.md           # Project documentation
```

## 🎯 How to Use

1. **Open the Application**: Navigate to the live demo or run locally
2. **Allow Camera Access**: Grant permission for webcam access when prompted
3. **Choose Background Option**:
   - **Default**: Shows original camera feed
   - **Custom Color**: Pick any color for background
   - **Virtual Backgrounds**: Select from 6 pre-loaded backgrounds
   - **Custom Image**: Enter URL of your own background image
4. **Real-time Processing**: The AI processes your video feed in real-time

## 🔧 Local Development

### Prerequisites
- Modern web browser with webcam support
- Local web server (for development)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/rajat-0206/virtual_background.git
   cd virtual_background
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

## 🌐 Browser Compatibility

- Chrome 67+
- Firefox 60+
- Safari 11+
- Edge 79+

## 📱 Mobile Support

The application works on mobile devices with webcam support, though performance may vary based on device capabilities.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

**Developed by [Rajat Shrivastava](https://github.com/rajat-0206)**

## 🙏 Acknowledgments

- **PeterL1n** for the original [RobustVideoMatting TensorFlow.js implementation](https://github.com/PeterL1n/RobustVideoMatting/tree/tfjs)
- This project is based on the RobustVideoMatting TensorFlow.js implementation by PeterL1n. The code and pre-trained model are sourced from the original repository.
- TensorFlow.js team for the amazing framework
- Robust Video Matting research team
- All contributors and users of this project

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

⭐ **Star this repository if you find it useful!**

