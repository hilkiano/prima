import { BoxProps, Box, BackgroundImage, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import React from "react";

type TProductsImageThumbnail = {
  image: string;
  removeFn: () => void;
};

const ProductsImageThumbnail = React.forwardRef<
  HTMLDivElement,
  BoxProps & TProductsImageThumbnail
>(({ image, removeFn, ...props }, ref) => {
  const t = useTranslations("Products.Add");
  return (
    <Box {...props}>
      <BackgroundImage src={image} radius="md">
        <div className="h-[6rem]"></div>
      </BackgroundImage>
      <ActionIcon
        size="sm"
        variant="filled"
        radius="xl"
        color="red"
        type="button"
        aria-label="remove image"
        className="absolute top-1 right-1"
        onClick={removeFn}
      >
        <IconTrash stroke={2} size={14} />
      </ActionIcon>
    </Box>
  );
});

ProductsImageThumbnail.displayName = "ProductsImageThumbnail";
export default ProductsImageThumbnail;
