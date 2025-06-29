---
title: "Machine Learning in JavaScript with TensorFlow.js"
date: "2024-03-02"
coverImage: "./assets/cover.jpg"
excerpt: "Explore how to implement machine learning models in the browser using TensorFlow.js, from basic neural networks to transfer learning."
---

# Machine Learning in JavaScript with TensorFlow.js

Learn how to implement machine learning models directly in the browser using TensorFlow.js. We'll cover everything from basic neural networks to transfer learning.

## Getting Started

First, set up TensorFlow.js:

```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
```

## Basic Neural Network

Create a simple neural network:

```javascript
// Define the model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [28 * 28] }));
model.add(tf.layers.dropout({ rate: 0.2 }));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

// Compile the model
model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});
```

## Training the Model

Train your model with data:

```javascript
async function trainModel(model, data) {
  const history = await model.fit(
    data.trainImages,
    data.trainLabels,
    {
      epochs: 10,
      validationSplit: 0.2,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(3)}`);
        }
      }
    }
  );
  return history;
}
```

## Image Classification

Implement image classification:

```javascript
async function classifyImage(model, imageElement) {
  // Pre-process the image
  const tensor = tf.browser.fromPixels(imageElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();

  // Make prediction
  const prediction = await model.predict(tensor).data();
  return prediction;
}
```

## Transfer Learning

Use pre-trained models:

```javascript
async function loadMobileNet() {
  const mobilenet = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  );
  
  // Remove the top layer
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({ inputs: mobilenet.inputs, outputs: layer.output });
}
```

## Real-time Predictions

Implement real-time video predictions:

```javascript
async function predictWebcam() {
  const video = document.getElementById('webcam');
  
  while (true) {
    const prediction = await classifyImage(model, video);
    updateUI(prediction);
    await tf.nextFrame();
  }
}
```

## Best Practices

1. Optimize model size for browser
2. Use WebGL backend when available
3. Implement proper error handling
4. Cache model weights
5. Use progressive loading
6. Monitor memory usage

## Conclusion

TensorFlow.js brings the power of machine learning to the browser, enabling new types of interactive applications. Start with simple models and gradually move to more complex implementations as you get comfortable with the framework. 