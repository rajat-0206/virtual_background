let valueChanged = false;

let selectedColor = '#ffffff';
let customImageUrl = '';
async function main() {
    const video = document.querySelector('video');
    const canvas = document.querySelector('canvas');
    const select = document.querySelector('select');
    let previousValue = select.value;

    video.width = 640;
    video.height = 480;

    const webcam = await tf.data.webcam(video);
    const model = await tf.loadGraphModel('model/model.json');
    
    // Hide loading message once model is loaded
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }

    // Setup control panel event listeners after DOM is ready
    setTimeout(() => {
        setupControlPanels();
    }, 500);

    let [r1i, r2i, r3i, r4i] = [tf.tensor(0.), tf.tensor(0.), tf.tensor(0.), tf.tensor(0.)];
    const downsample_ratio = tf.tensor(0.5);

    // Global variables for custom options
    

    const backgroundOptions = {
        'default': { fgr: false, pha: false, background: null }, // Show original video
        'color': { fgr: true, pha: true, background: null }, // Will be set dynamically
        'image': { fgr: true, pha: true, background: 'url(images/image2.png) center center / cover' },
        'image3': { fgr: true, pha: true, background: 'url(images/image3.png) center center / cover' },
        'image4': { fgr: true, pha: true, background: 'url(images/image4.jpg) center center / cover' },
        'image5': { fgr: true, pha: true, background: 'url(images/image5.avif) center center / cover' },
        'image6': { fgr: true, pha: true, background: 'url(images/image6.jpg) center center / cover' },
        'image8': { fgr: true, pha: true, background: 'url(images/image8.avif) center center / cover' },
        'custom-image': { fgr: true, pha: true, background: null }, // Will be set dynamically
        'blur': { fgr: true, pha: false, background: null } // handled separately
    };

    while (true) {
        await tf.nextFrame();
        const img = await webcam.capture();
        const src = tf.tidy(() => img.expandDims(0).div(255));
        const [fgr, pha, r1o, r2o, r3o, r4o] = await model.executeAsync(
            { src, r1i, r2i, r3i, r4i, downsample_ratio },
            ['fgr', 'pha', 'r1o', 'r2o', 'r3o', 'r4o']
        );

        const viewOption = select.value;
        valueChanged = viewOption !== previousValue;
        previousValue = viewOption;

        // Debug logging
        if (valueChanged) {
            console.log('View option changed to:', viewOption);
            if (viewOption === 'color') console.log('Selected color:', selectedColor);
            if (viewOption === 'custom-image') console.log('Custom image URL:', customImageUrl);
        }

        if (valueChanged && (viewOption.includes('image') || viewOption === 'blur')) {
                drawHidden(r4o, canvas);
        }

        if (viewOption === 'default') {
            // Show original video without any processing
            canvas.style.background = 'none';
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else if (viewOption === 'color') {
            const fgrTensor = fgr.clone();
            const phaTensor = pha.clone();
            drawMatte(fgrTensor, phaTensor, canvas);
            canvas.style.background = selectedColor;
            tf.dispose([fgrTensor, phaTensor]);
        } else if (viewOption === 'custom-image') {
            const fgrTensor = fgr.clone();
            const phaTensor = pha.clone();
            drawMatte(fgrTensor, phaTensor, canvas);
            if (customImageUrl) {
                canvas.style.background = `url(${customImageUrl}) center center / cover`;
            }
            tf.dispose([fgrTensor, phaTensor]);
        } else if (viewOption === 'blur') {
            const fgrTensor = fgr.clone();
            const phaTensor = pha.clone();
            drawMatte(fgrTensor, phaTensor, canvas);
            const baseImage = await drawImage(img, canvas);
            canvas.style.background = `url(${baseImage})`;
            tf.dispose([fgrTensor, phaTensor]);
        } else if (backgroundOptions[viewOption]) {
            const option = backgroundOptions[viewOption];
            const fgrTensor = option.fgr ? fgr.clone() : null;
            const phaTensor = option.pha ? pha.clone() : null;
            drawMatte(fgrTensor, phaTensor, canvas);
            if (option.background) {
                canvas.style.background = option.background;
            }
            if (fgrTensor) tf.dispose(fgrTensor);
            if (phaTensor) tf.dispose(phaTensor);
        }

        tf.dispose([img, src, fgr, pha, r1i, r2i, r3i, r4i]);
        [r1i, r2i, r3i, r4i] = [r1o, r2o, r3o, r4o];
    }
}

async function drawImage(img, canvas, blurAmount = 10) {
    const imgcanvas = document.getElementById('imgcanvas');
        // Make sure tensor is in uint8 format and shape [height, width, 3]
    const [height, width, channels] = img.shape;
    let imgTensor = img;
    if (img.dtype !== 'int32' && img.dtype !== 'uint8') {
        imgTensor = img.mul(255).cast('int32');
    }
    const data = new Uint8ClampedArray(await imgTensor.data());
    let rgbaData = new Uint8ClampedArray(width * height * 4);
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
        rgbaData[j] = data[i];     // R
        rgbaData[j + 1] = data[i + 1]; // G
        rgbaData[j + 2] = data[i + 2]; // B
        rgbaData[j + 3] = 255;     // A
    }
    const imageData = new ImageData(rgbaData, width, height);
    imgcanvas.width = width;
    imgcanvas.height = height;
    imgcanvas.getContext('2d').putImageData(imageData, 0, 0);
    const ctx = imgcanvas.getContext('2d');
    ctx.filter = `blur(${blurAmount}px)`;
    ctx.drawImage(imgcanvas, 0, 0);
    ctx.filter = 'none';
    return imgcanvas.toDataURL();
}

async function drawMatte(fgr, pha, canvas) {
    const rgba = tf.tidy(() => {
        const rgb = (fgr !== null) ?
            fgr.squeeze(0).mul(255).cast('int32') :
            tf.fill([pha.shape[1], pha.shape[2], 3], 255, 'int32');
        const a = (pha !== null) ?
            pha.squeeze(0).mul(255).cast('int32') :
            tf.fill([fgr.shape[1], fgr.shape[2], 1], 255, 'int32');
        return tf.concat([rgb, a], -1);
    });
    
    // Don't dispose tensors here as they might be used elsewhere
    const [height, width] = rgba.shape.slice(0, 2);
    const pixelData = new Uint8ClampedArray(await rgba.data());
    const imageData = new ImageData(pixelData, width, height);
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);
    rgba.dispose();
}

async function drawHidden(r, canvas) {
    const rgba = tf.tidy(() => {
        r = r.unstack(-1)
        r = tf.concat(r, 1)
        r = r.split(4, 1)
        r = tf.concat(r, 2)
        r = r.squeeze(0)
        r = r.expandDims(-1)
        r = r.add(1).mul(127.5).cast('int32')
        r = r.tile([1, 1, 3])
        r = tf.concat([r, tf.fill([r.shape[0], r.shape[1], 1], 255, 'int32')], -1)
        return r;
    });
    const [height, width] = rgba.shape.slice(0, 2);
    const pixelData = new Uint8ClampedArray(await rgba.data());
    const imageData = new ImageData(pixelData, width, height);
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').putImageData(imageData, 0, 0);
    rgba.dispose();
}

function setupControlPanels() {
    const select = document.getElementById('backgroundSelect');
    const colorPanel = document.getElementById('colorPanel');
    const customImagePanel = document.getElementById('customImagePanel');
    const blurPanel = document.getElementById('blurPanel');
    const colorPicker = document.getElementById('colorPicker');
    const imageUrl = document.getElementById('imageUrl');
    const applyImageBtn = document.getElementById('applyImageBtn');

    // Check if all elements exist
    if (!select || !colorPanel || !customImagePanel || !colorPicker || !imageUrl || !applyImageBtn) {
        console.error('Some control panel elements not found');
        return;
    }

    console.log('Setting up control panels...');

    // Handle dropdown change
    select.addEventListener('change', function() {
        const selectedValue = this.value;
        console.log('Selected option:', selectedValue);
        
        // Hide all panels
        colorPanel.style.display = 'none';
        customImagePanel.style.display = 'none';
        
        // Show relevant panel
        if (selectedValue === 'color') {
            colorPanel.style.display = 'block';
        } else if (selectedValue === 'custom-image') {
            customImagePanel.style.display = 'block';
        }
    });

    // Handle color picker change
    colorPicker.addEventListener('change', function() {
        selectedColor = this.value;
        console.log('Color changed to:', selectedColor);
    });

    // Handle custom image URL
    applyImageBtn.addEventListener('click', function() {
        const url = imageUrl.value.trim();
        if (url) {
            customImageUrl = url;
            console.log('Custom image URL set to:', customImageUrl);
            // Test if image loads
            const testImg = new Image();
            testImg.onload = function() {
                console.log('Custom image loaded successfully');
            };
            testImg.onerror = function() {
                alert('Failed to load image. Please check the URL.');
                customImageUrl = '';
            };
            testImg.src = url;
        }
    });

    // Handle Enter key in URL input
    imageUrl.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyImageBtn.click();
        }
    });

    console.log('Control panels setup complete');
}

// Setup control panels when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        setupControlPanels();
    }, 100);
});

window.addEventListener('load', main); 