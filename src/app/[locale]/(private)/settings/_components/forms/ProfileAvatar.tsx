import { useUserContext } from "@/lib/userProvider";
import {
  ActionIcon,
  Avatar,
  Box,
  BoxProps,
  Button,
  FileInput,
  Input,
  Modal,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconCancel, IconCheck, IconFolderFilled } from "@tabler/icons-react";
import { CircleStencil, Cropper, CropperPreview } from "react-advanced-cropper";
import { useTranslations } from "next-intl";
import React from "react";
import useProfileAvatar from "../../_hooks/profile_avatar.hooks";
import { Controller } from "react-hook-form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { srcToFile } from "@/lib/helpers";
import Compressor from "compressorjs";

const ProfileAvatar = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ ...props }, ref) => {
    const { userData } = useUserContext();
    const tButton = useTranslations("Button");
    const t = useTranslations("Settings.Profile");
    const {
      mutationUpload,
      mutationSave,
      form,
      image,
      setImage,
      cropperRef,
      onCrop,
      maxFileSize,
    } = useProfileAvatar();
    const fileRef = React.useRef<HTMLButtonElement>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const theme = useMantineTheme();
    const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);

    return (
      <Box {...props}>
        <form
          noValidate
          onSubmit={form.handleSubmit(async () => {
            if (image) {
              const formData = new FormData();
              const file = await srcToFile(
                image,
                `${userData?.user.id}.webp`,
                "image/webp"
              );

              new Compressor(file, {
                quality: 0.6,
                success: (result) => {
                  formData.append("directory", "avatar");
                  formData.append(
                    "files[0]",
                    result,
                    `${userData?.user.id}.webp`
                  );

                  mutationUpload.mutate(formData);
                },
              });
            }
          })}
          id="profpic-form"
          className="relative w-fit"
        >
          <Controller
            name="avatar"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <>
                <Input.Label>{t("label_profile_picture")}</Input.Label>
                <FileInput
                  ref={fileRef}
                  value={value}
                  onChange={(val) => {
                    onChange(val);
                    if (val && val.size <= maxFileSize) {
                      open();
                    }
                  }}
                  accept="image/png,image/jpeg,image/jpg"
                  clearable
                  className="hidden"
                />
                <Avatar
                  src={image ? image : userData?.user.avatar_url}
                  alt={userData?.user.display_name}
                  className="w-48 h-48 mt-2"
                />
                {form.formState.errors?.avatar?.message ? (
                  <Input.Error className="absolute -bottom-5 left-0 font-bold text-nowrap">
                    {form.formState.errors?.avatar?.message}
                  </Input.Error>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          {image ? (
            <div className="absolute bottom-0 right-0">
              <div className="flex gap-2 flex-row">
                <Tooltip
                  openDelay={500}
                  position="bottom"
                  label={t("tooltip_remove_image")}
                >
                  <ActionIcon
                    size="lg"
                    variant="filled"
                    color="red"
                    radius="xl"
                    type="button"
                    onClick={() => {
                      form.reset();
                      setImage(undefined);
                    }}
                    aria-label="cancel"
                  >
                    <IconCancel stroke={3} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  openDelay={500}
                  position="bottom"
                  label={t("tooltip_submit_image")}
                >
                  <ActionIcon
                    size="lg"
                    variant="filled"
                    color="green"
                    radius="xl"
                    type="submit"
                    form="profpic-form"
                    aria-label="upload"
                    loading={mutationUpload.isPending || mutationSave.isPending}
                  >
                    <IconCheck stroke={3} />
                  </ActionIcon>
                </Tooltip>
              </div>
            </div>
          ) : (
            <Tooltip
              openDelay={500}
              position="bottom"
              label={t("tooltip_browse_image")}
            >
              <ActionIcon
                size="xl"
                className="absolute bottom-0 right-0"
                variant="filled"
                radius="xl"
                type="button"
                onClick={() => {
                  fileRef.current?.click();
                }}
                aria-label="change picture"
              >
                <IconFolderFilled stroke={3} />
              </ActionIcon>
            </Tooltip>
          )}
        </form>

        <Modal
          opened={opened}
          onClose={() => {
            close();
            setImage(undefined);
          }}
          size="xl"
          centered
          fullScreen={isMobile}
          title={t("modal_cropper")}
          keepMounted={false}
        >
          {form.getValues("avatar") ? (
            <>
              <Cropper
                ref={cropperRef}
                stencilProps={{
                  aspectRatio: 1 / 1,
                }}
                stencilComponent={CircleStencil}
                src={URL.createObjectURL(form.getValues("avatar")!)}
                className="w-full rounded-xl xs:h-[calc(100vh-350px)] h-[calc(100vh-180px)]"
              />
              <div className="mt-6 flex justify-end">
                <Button
                  variant="filled"
                  onClick={() => {
                    close();
                    onCrop();
                  }}
                  leftSection={<IconCheck />}
                >
                  {tButton("done")}
                </Button>
              </div>
            </>
          ) : (
            <></>
          )}
        </Modal>
      </Box>
    );
  }
);

ProfileAvatar.displayName = "ProfileAvatar";
export default ProfileAvatar;
