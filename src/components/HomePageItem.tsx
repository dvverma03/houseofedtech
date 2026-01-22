import { Dimensions, Image, StyleSheet, View } from "react-native";
import { HomepageDataItem } from "../config/homepageData";
import SectionTitle from "./SectionTitle";
import Slider from "./Slider";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;
const IMAGE_HEIGHT = IMAGE_WIDTH * (1800 / 2395);
/**
 * Reusable section component for homepage items
 */
export const HomepageSection = ({ item }: { item: HomepageDataItem }) => {
    return (
      <View style={styles.button}>
        <SectionTitle title={item.title} />
        <Image
          source={{ uri: item.sectionImage }}
          style={{ width: IMAGE_WIDTH, height: IMAGE_HEIGHT }}
          resizeMode="cover"
        />
        <View style={{ marginTop: 12 }} />
        <Slider
          onSwipeComplete={item.onSlideAction}
          text={item.sliderText}
          successMessage={item.successMessage || "Swiped Successfully!"}
        />
      </View>
    );
  };

  const styles = StyleSheet.create({
    button: {
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 1,
      borderColor: "#e0e0e0",
      borderWidth: 1,
      borderRadius: 2,
      marginBottom: 24,
    },
  });