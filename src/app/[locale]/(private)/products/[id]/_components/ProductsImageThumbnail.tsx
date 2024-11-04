import { BoxProps, Box, BackgroundImage, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

type TProductsImageThumbnail = {
  image: string;
};

const ProductsImageThumbnail = React.forwardRef<
  HTMLDivElement,
  BoxProps & TProductsImageThumbnail
>(({ image, ...props }, ref) => {
  const t = useTranslations("Products.Add");
  return (
    <Box {...props}>
      <BackgroundImage src={image} radius="md">
        <div className="h-[6rem]"></div>
      </BackgroundImage>
    </Box>
  );
});

ProductsImageThumbnail.displayName = "ProductsImageThumbnail";
export default ProductsImageThumbnail;
