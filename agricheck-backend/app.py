from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import cv2 as cv
import os
from PIL import Image

app = Flask(__name__)
model = load_model('model.h5')

label_name = ['Apple scab','Apple Black rot', 'Apple Cedar apple rust', 'Apple healthy', 'Cherry Powdery mildew',
'Cherry healthy','Corn Cercospora leaf spot Gray leaf spot', 'Corn Common rust', 'Corn Northern Leaf Blight','Corn healthy', 
'Grape Black rot', 'Grape Esca', 'Grape Leaf blight', 'Grape healthy','Peach Bacterial spot','Peach healthy', 'Pepper bell Bacterial spot', 
'Pepper bell healthy', 'Potato Early blight', 'Potato Late blight', 'Potato healthy', 'Strawberry Leaf scorch', 'Strawberry healthy',
'Tomato Bacterial spot', 'Tomato Early blight', 'Tomato Late blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot',
'Tomato Spider mites', 'Tomato Target Spot', 'Tomato Yellow Leaf Curl Virus', 'Tomato mosaic virus', 'Tomato healthy']

label_description = ['Apple scab','Fungal disease leading to dark, sunken lesions on apple fruit, leaves and branches.', 'Apple Cedar apple rust', 'Apple healthy', 'Fungal infection causing white, powdery growth on cherry leaves stems, and buds.',
'Cherry healthy','A fungal disease on corn, characterized by small, dark lesions with grayish centers, causing premature leaf death and reduced photosynthesis.', 'Corn Common rust', 'Corn Northern Leaf Blight','Corn healthy', 
'Grape Black rot', 'Grape Esca', 'Grape Leaf blight', 'Grape healthy','Bacterial infection causing dark lesions and defoliation on peach leaves and fruit.','Healthy peach leaves are vibrant green, free from spots or lesions and exhibit normal growth without signs of disease or stress.', 'Pepper bell Bacterial spot', 
'Pepper bell healthy', 'Potato Early blight', 'Potato Late blight', 'Potato healthy', 'Caused by environmental stress, this condition leads to yellowing, browning, and crispy edges on strawberry leaves, often worsened by heat or water stress.', 'Strawberry healthy',
'Tomato Bacterial spot', 'Tomato Early blight', 'Tomato Late blight', 'Tomato Leaf Mold', 'Tomato Septoria leaf spot',
'Tomato Spider mites', 'Tomato Target Spot', 'Tomato Yellow Leaf Curl Virus', 'Tomato mosaic virus', 'Tomato healthy']

# Set directory for uploaded files
UPLOAD_FOLDER = "static/uploaded/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to preprocess the image
def preprocess_image(image_path):
        # Read the image file in binary mode
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        
        # Decode the image bytes to OpenCV format
        img = cv.imdecode(np.frombuffer(image_bytes, dtype=np.uint8), cv.IMREAD_COLOR)
        
        # Convert to RGB color space, resize, and normalize the image
        resized_image = cv.resize(cv.cvtColor(img, cv.COLOR_BGR2RGB), (150, 150))
        normalized_image = np.expand_dims(resized_image, axis=0)
        
        return normalized_image

@app.route("/api/img", methods=["POST"])
def upload_image():
    if "photo.0" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["photo.0"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # Preprocess and predict
    image = preprocess_image(file_path)
    predictions = model.predict(image)
    # os.remove(file_path)  # Clean up the uploaded file
    
    # {"Label Name":label_name[np.argmax(predictions)],
    #               "Accuracy": predictions[0][np.argmax(predictions)]*100}
    # Convert predictions to a list for JSON response

    if(predictions[0][np.argmax(predictions)]*100 >= 80) :
        response = label_name[np.argmax(predictions)]
        description = label_description[np.argmax(predictions)]
        # print(description)
    else :
        response = 'Try Another Image!'

    # print(predictions[0][np.argmax(predictions)]*100)
    return jsonify({"predictions": response, "description": description})
    
