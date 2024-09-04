"use client";

import {
  Accordion,
  Button,
  Center,
  Skeleton,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";
import {
  IconAppWindow,
  IconCheck,
  IconDatabase,
  IconExclamationCircleFilled,
  IconKey,
} from "@tabler/icons-react";
import { TGroupFormState } from "@/types/page.types";
import { JsonResponse, ListResult } from "@/types/common.types";
import { useUserContext } from "@/lib/userProvider";

type TGroupForm = {
  formState: TGroupFormState;
};

const PrivilegesSkeleton: React.FC = () => {
  const skeletonCount = 3;

  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: skeletonCount }, (_, index) => (
        <Skeleton key={index} height={50} />
      ))}
    </div>
  );
};

const PrivilegesAccordions: React.FC<{
  formState: TGroupFormState;
  data: JsonResponse<ListResult<Privilege[]>>;
}> = ({ formState, data }) => {
  const privileges = data.data.rows;
  const groupByType = privileges.reduce(function (
    rv: { [type: string]: Privilege[] },
    x: Privilege
  ) {
    (rv[x["type"]] = rv[x["type"]] || []).push(x);
    return rv;
  },
  {});

  const AccordionControlIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "PAGE":
        return <IconAppWindow />;
      case "DATA":
        return <IconDatabase />;

      default:
        return <IconKey />;
    }
  };

  const AccordionItems = ({
    formState,
    groupedPrivileges,
  }: {
    formState: TGroupFormState;
    groupedPrivileges: { [type: string]: Privilege[] };
  }) => {
    const tPrivilege = useTranslations("Privileges");
    const t = useTranslations("Groups");
    const [privileges, setPrivileges] = React.useState<string[]>(
      formState.form.getValues("privileges")
    );

    React.useEffect(() => {
      formState.form.setValue("privileges", privileges);
    }, [formState, privileges]);

    const accordionItems = Object.keys(groupedPrivileges).map((type) => (
      <Accordion.Item key={type} value={type}>
        <Accordion.Control icon={<AccordionControlIcon type={type} />}>
          <div className="flex flex-row gap-2 items-center">
            {t(`Form.privilege_${type.toLowerCase()}_title`)}
            <p className="m-0 mt-1 opacity-70 italic text-xs font-semibold">
              {t("Form.privilege_selected", {
                selected: groupedPrivileges[type]
                  .filter((p) => privileges.includes(p.id))
                  .length.toString(),
                total: groupedPrivileges[type].length.toString(),
              })}
            </p>
          </div>
        </Accordion.Control>
        <Accordion.Panel>
          <div className="flex flex-col gap-4">
            {groupedPrivileges[type].map((privilege) => (
              <Switch
                key={privilege.id}
                size="md"
                checked={privileges.includes(privilege.id)}
                onChange={(event) => {
                  if (privileges.includes(privilege.id)) {
                    const filteredPrivileges = privileges.filter(
                      (p) => p !== privilege.id
                    );
                    setPrivileges(filteredPrivileges);
                  } else {
                    setPrivileges([...privileges, privilege.id]);
                  }
                }}
                label={tPrivilege(privilege.desc_i18n)}
              />
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    ));

    return <>{accordionItems}</>;
  };

  return (
    <Accordion variant="separated">
      {<AccordionItems formState={formState} groupedPrivileges={groupByType} />}
    </Accordion>
  );
};

const GroupForm = React.forwardRef<HTMLDivElement, TGroupForm>(
  ({ formState, ...props }, ref) => {
    const tError = useTranslations("Error");
    const tButton = useTranslations("Button");
    const t = useTranslations("Groups");
    const { userData } = useUserContext();

    return (
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={formState.form.handleSubmit((data) => {
          if (typeof data.id !== "undefined") {
            formState.mutationUpdate.mutate({
              class: "Group",
              payload: {
                payload: {
                  id: data.id,
                  name: data.name,
                  description: data.description,
                  privileges: data.privileges,
                },
              },
            });
          } else {
            formState.mutationCreate.mutate({
              class: "Group",
              payload: {
                payload: {
                  name: data.name,
                  description: data.description,
                  privileges: data.privileges,
                  company_id: userData?.user.company_id,
                  outlet_id: userData?.user.outlet_id,
                },
              },
            });
          }
        })}
      >
        <Controller
          name="name"
          control={formState.form.control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="w-full"
              size="lg"
              label={t("Columns.name")}
              error={formState.form.formState.errors.name?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
              required
            />
          )}
        />
        <Controller
          name="description"
          control={formState.form.control}
          render={({ field: { onChange, value } }) => (
            <Textarea
              label={t("Columns.description")}
              error={formState.form.formState.errors.description?.message}
              autoComplete="off"
              value={value}
              onChange={onChange}
              autosize
              minRows={3}
              maxRows={4}
            />
          )}
        />

        <p className="mb-0">{t("Columns.privileges")}</p>
        {formState.form.formState.errors.privileges?.message ? (
          <p className="font-bold text-sm -mt-4 m-0 leading-none text-red-500">
            {formState.form.formState.errors.privileges?.message}
          </p>
        ) : (
          <></>
        )}
        {formState.query.isLoading ? (
          <PrivilegesSkeleton />
        ) : formState.query.isSuccess ? (
          <PrivilegesAccordions
            formState={formState}
            data={formState.query.data}
          />
        ) : (
          <Center className="flex-col gap-0">
            <IconExclamationCircleFilled size={50} className="opacity-45" />
            <p className="opacity-45 italic m-0 text-lg">
              {tError("general_error")}
            </p>
          </Center>
        )}

        <div className="flex justify-end mt-4 gap-4">
          <Button
            loading={
              formState.mutationCreate.isPending ||
              formState.mutationUpdate.isPending
            }
            leftSection={<IconCheck />}
            type="submit"
            size="lg"
          >
            {tButton("done")}
          </Button>
        </div>
      </form>
    );
  }
);

GroupForm.displayName = "GroupForm";
export default GroupForm;
