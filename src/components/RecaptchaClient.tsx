// src/components/RecaptchaClient.tsx
"use client";
import { forwardRef } from "react";
import ReCAPTCHA, { type ReCAPTCHAProps } from "react-google-recaptcha";

const RecaptchaClient = forwardRef<ReCAPTCHA, ReCAPTCHAProps>((props, ref) => (
  // @ts-ignore – los tipos de la librería no exponen ref aún
  <ReCAPTCHA {...props} ref={ref} />
));

RecaptchaClient.displayName = "RecaptchaClient";

export default RecaptchaClient;
