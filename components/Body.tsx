"use client";

import Image from "next/image";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent } from "react";
import { Download, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, Card, CardContent } from "@/components/ui/card";

import { nanoid } from "nanoid";
import QRCode from "qrcode";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

const formSchema = z.object({
  text: z.string().min(1, {
    message: "Text or URL must be at least 1 character.",
  }),
});

type GenerateFormValues = z.infer<typeof formSchema>;

type UserInput = {
  id: string;
  value: string;
};

const Body = () => {
  const [inputValues, setInputValues] = useState<UserInput[]>([]);
  const [svgUrls, setSvgUrls] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [margin, setMargin] = useState<number>(1);
  const [width, setWidth] = useState<number>();
  const [darkColor, setDarkColor] = useState<string>("#000000");
  const [lightColor, setLightColor] = useState<string>("#ffffff");
  const [maskPattern, setMaskPattern] = useState<string>("0");
  const [errorCorrectionLevel, setErrorCorrectionLevel] =
    useState<string>("medium");

  const handleMarginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMargin(Number(value)); // Convert to number
  };

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWidth(Number(value)); // Convert to number
  };

  const handleDarkColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDarkColor(e.target.value); // Get the color value
  };

  const handleLightColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLightColor(e.target.value); // Get the color value
  };

  const handleErrorCorrectionLevelChange = (value: string) => {
    setErrorCorrectionLevel(value);
  };

  const handleMaskPatternChange = (value: string) => {
    setMaskPattern(value);
  };

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",

    // Set default values so that the form inputs are controlled components.
    defaultValues: {
      text: "google.com",
    },
  });

  const generateQRCodes = async () => {
    const opts = {
      errorCorrectionLevel,
      maskPattern,
      type: "image/jpeg",
      margin,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      width: width || 500,
    };

    const generatedUrls = [];
    const stringsArray = inputValues.map((el) => el.value);

    // Generate a QR code SVG for each string in the array
    for (const text of stringsArray) {
      try {
        const svgUrl = await QRCode.toDataURL(text, opts);
        generatedUrls.push(svgUrl);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    }

    // Set the generated SVG URLs into state to render them
    setSvgUrls(generatedUrls);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stringsArray, opts }),
    });

    if (response.status !== 200) {
      console.error("Failed to generate QR codes");
      return; // Handle the error appropriately
    }

    const data = await response.json();
    setDownloadLink(data.downloadUrl); // Set the download link once available
  };

  // Handle adding new input field
  const handleAddField = (text: string) => {
    console.log({ text });
    setInputValues([...inputValues, { id: nanoid(), value: text }]);
  };

  const handleRemoval = (id: string) => {
    setInputValues((prev) => prev.filter((value) => value.id !== id));
  };

  // For some reason, if handleSubmit is removed, the page will keep auto-reloading, to be investigate later
  const handleSubmit = async () => {};

  return (
    <div className="flex justify-center items-center flex-col w-full lg:p-0 p-4 sm:mb-28 mb-0">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mt-10">
        <div className="col-span-1">
          <h1 className="text-3xl font-bold mb-10">Generate a QR Code</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text or URL</FormLabel>
                      <FormControl>
                        <>
                          <Input placeholder="google.com" {...field} />
                          <Button
                            variant="outline"
                            onClick={() => handleAddField(field.value)}
                            disabled={!field.value}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add links
                          </Button>
                        </>
                      </FormControl>
                      <FormDescription>
                        This is what your QR code will represent.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Added texts and links</FormLabel>
                  <FormDescription>Click to remove item.</FormDescription>
                  <FormControl>
                    <>
                      {inputValues?.map((input, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full "
                          onClick={() => handleRemoval(input.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          {input.value}
                        </Button>
                      ))}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </form>
          </Form>
          <Card className="my-3">
            <CardHeader>
              <CardTitle>QR Code Settings (optional)</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="errorCorrectionLevel">
                    Error Correction Level
                  </Label>
                  <Select
                    defaultValue={errorCorrectionLevel}
                    onValueChange={handleErrorCorrectionLevelChange}
                  >
                    <SelectTrigger id="errorCorrectionLevel">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="quartile">Quartile</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mask-pattern">Mask Pattern</Label>
                  <Select
                    defaultValue={maskPattern}
                    onValueChange={handleMaskPatternChange}
                  >
                    <SelectTrigger id="mask-pattern">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="darkColor">Dark Color</Label>
                  <Input
                    id="darkColor"
                    type="color"
                    value={darkColor}
                    onChange={handleDarkColorChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lightColor">Light Color</Label>
                  <Input
                    id="lightColor"
                    type="color"
                    value={lightColor}
                    onChange={handleLightColorChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="margin">Margin (px)</Label>
                  <Input
                    id="margin"
                    type="number"
                    value={margin}
                    onChange={handleMarginChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={handleWidthChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Button
            disabled={inputValues.length === 0}
            className="justify-center m-3
                  mx-auto w-full"
            onClick={generateQRCodes}
          >
            ✨ Generate
          </Button>
          {downloadLink && (
            <Button
              className="justify-center 
                  mx-auto w-full "
            >
              <Download className="h-4 w-4 mr-2" />
              <Link href={downloadLink} download="qrcodes.zip">
                Download All QR Codes as ZIP
              </Link>
            </Button>
          )}
        </div>
        <div className="col-span-1">
          <h1 className="text-3xl font-bold sm:mb-5 mb-5 mt-5 sm:mt-0 sm:text-center text-left">
            Your QR Code
          </h1>
          <div className="flex flex-col justify-center relative h-auto items-center"></div>
          <div className="flex flex-col justify-center relative h-auto items-center my-3">
            {svgUrls.map((svgUrl, index) => (
              <div
                className="container border flex justify-center my-1 rounded-md"
                key={index}
              >
                <Image
                  src={svgUrl}
                  alt={`QR code ${index + 1}`}
                  width={500}
                  height={500}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
