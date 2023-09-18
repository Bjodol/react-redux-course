import { FC, useState } from "react";

type Form = {
  name: string;
  email: string;
};

export const MyForm: FC = () => {
  const [form, setForm] = useState<Form>({ name: "", email: "" });

  const onFormValue = (fieldName: string, value: string) => {
    setForm((prev) => {
      return {
        ...prev,
        [fieldName]: value,
      };
    });
  };

  console.log(form);

  return (
    <div>
      <label>Name</label>
      <input
        name="name"
        type="text"
        value={form.name}
        onChange={(event) => {
          onFormValue("name", event.target.value);
        }}
      />
      <label>Email</label>
      <input
        name="email"
        type="text"
        value={form.email}
        onChange={(event) => {
          onFormValue("email", event.target.value);
        }}
      />
    </div>
  );
};
