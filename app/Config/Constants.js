import { Dimensions } from "react-native";

export const { width, height } = Dimensions.get("screen");

export const screen_height = height;
export const screen_width = width;

export const text_input_height = 150;
export const footer_height = 70;
export const login_view_height = text_input_height + footer_height;
