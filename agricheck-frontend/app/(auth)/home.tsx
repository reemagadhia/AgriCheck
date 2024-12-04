import { ScrollView, Text, View, Image } from "react-native";

import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from "expo-image-picker";
import { FormItem, FormList } from "../../components/ui/Form";
import * as Colors from "@bacons/apple-colors";
import { IconSymbol } from "../../components/ui/IconSymbol";
import React = require("react");

function formDataFromImagePicker(result: ImagePicker.ImagePickerSuccessResult) {
  const formData = new FormData();

  for (const index in result.assets) {
    const asset = result.assets[index];
    formData.append(`photo.${index}`, {
      uri: asset.uri,
      name: asset.fileName ?? asset.uri.split("/").pop(),
      type: asset.mimeType,
    });

    if (asset.exif) {
      formData.append(`exif.${index}`, JSON.stringify(asset.exif));
    }
  }

  return formData;
}
const Home = () => {
  const { user } = useUser();
  const [results, setResults] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);
  const [selectedImageUri, setSelectedImageUri] = React.useState<string | null>(null);

  const pickImageWithResults = async (options: ImagePicker.ImagePickerOptions) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      ...options,
    });

    if (!result.canceled) {
      const response = await fetch("http://127.0.0.1:5000/api/img", {
        method: "POST",
        body: formDataFromImagePicker(result),
        headers: {
          Accept: "application/json",
        },
      });

      const jsonResponse = await response.json();
      setSelectedImageUri(result.assets[0].uri);
      setResults(jsonResponse.predictions);
      setDescription(jsonResponse.description);
    }
  };
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <FormList>
        <FormItem onPress={pickImageWithResults.bind(null, {})}>
          <IconSymbol
            name="photo.stack"
            size={24}
            style={{ width: 60 }}
            color={Colors.systemMint}
          />
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
            >
              Select media
            </Text>
            <Text style={{ color: Colors.secondaryLabel, fontSize: 16 }}>
              Upload for Leaf Disease Detection
            </Text>
          </View>
        </FormItem>
      </FormList>

      <FormList>
        {selectedImageUri && (
          <FormItem>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ color: Colors.label, fontSize: 18, fontWeight: "600" }}
              >
                Selected Image
              </Text>
              <Image
                source={{ uri: selectedImageUri }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 8,
                  marginVertical: 8,
                }}
              />
            </View>
          </FormItem>
        )}

        <FormItem>
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600"  }}
            >
              Results
            </Text>
            <Text style={{ color: Colors.systemTeal, fontSize: 16,  fontWeight: "600" }}>
              {results ? results : "No results yet"}
            </Text>
          </View>
        </FormItem>

        <FormItem>
          <View style={{ gap: 4 }}>
            <Text
              style={{ color: Colors.label, fontSize: 18, fontWeight: "600"  }}
            >
              Description
            </Text>
            <Text style={{ color: Colors.systemTeal, fontSize: 16, fontWeight: "600"  }}>
              {description ? description : ""}
            </Text>
          </View>
        </FormItem>
      </FormList>
    </ScrollView>
  );
};

export default Home;
