from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np

def preprocess_image(image_path, target_size=(224, 224)):
    img = Image.open(image_path).resize(target_size)
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img
