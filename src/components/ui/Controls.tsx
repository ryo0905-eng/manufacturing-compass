import type { ComponentProps, ReactNode } from "react";
import styles from "./controls.module.css";

type ButtonVariant = "primary" | "secondary" | "text";

function buttonClass(variant: ButtonVariant, className?: string) {
  return [styles.button, styles[variant], className].filter(Boolean).join(" ");
}

export function Button({ variant = "secondary", className, type = "button", ...props }: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button {...props} type={type} className={buttonClass(variant, className)} />;
}

// Native anchors retain external-link, download and standard HTML behavior.
export function ButtonLink({ variant = "secondary", className, ...props }: ComponentProps<"a"> & { variant?: ButtonVariant }) {
  return <a {...props} className={buttonClass(variant, className)} />;
}

export function SelectionButton({ selected, className, ...props }: Omit<ComponentProps<"button">, "aria-pressed"> & { selected: boolean }) {
  return <Button {...props} aria-pressed={selected} className={[styles.selection, className].filter(Boolean).join(" ")} />;
}

type FieldProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  error?: string;
};

export function FieldMessage({ error = false, className, ...props }: ComponentProps<"p"> & { error?: boolean }) {
  return <p {...props} role={error ? "alert" : props.role} className={[styles.message, error ? styles.error : "", className].filter(Boolean).join(" ")} />;
}

function Field({ id, label, description, error, children }: FieldProps & { children: ReactNode }) {
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    {children}
    {description ? <FieldMessage id={`${id}-help`}>{description}</FieldMessage> : null}
    {error ? <FieldMessage error id={`${id}-error`}>{error}</FieldMessage> : null}
  </div>;
}

function describedBy({ id, description, error }: FieldProps, extra?: string) {
  return [description ? `${id}-help` : undefined, error ? `${id}-error` : undefined, extra].filter(Boolean).join(" ") || undefined;
}

export function InputField({ label, description, error, className, ...props }: ComponentProps<"input"> & FieldProps) {
  const field = { id: props.id, label, description, error };
  return <Field {...field}><input {...props} className={[styles.control, className].filter(Boolean).join(" ")} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(field, props["aria-describedby"])} /></Field>;
}

export function TextareaField({ label, description, error, className, ...props }: ComponentProps<"textarea"> & FieldProps) {
  const field = { id: props.id, label, description, error };
  return <Field {...field}><textarea {...props} className={[styles.control, styles.textarea, className].filter(Boolean).join(" ")} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(field, props["aria-describedby"])} /></Field>;
}

export function SelectField({ label, description, error, className, ...props }: ComponentProps<"select"> & FieldProps) {
  const field = { id: props.id, label, description, error };
  return <Field {...field}><select {...props} className={[styles.control, className].filter(Boolean).join(" ")} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(field, props["aria-describedby"])} /></Field>;
}

export function Notice({ tone = "info", className, ...props }: ComponentProps<"div"> & { tone?: "info" | "warning" | "error" | "success" }) {
  return <div {...props} className={[styles.notice, styles[tone], className].filter(Boolean).join(" ")} />;
}
