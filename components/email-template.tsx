interface EmailTemplateProps {
  text: string;
}

export function EmailTemplate({ text }: EmailTemplateProps) {
  return (
    <div>
      <h1>Reset your password!</h1>
      <p>{text}</p>
    </div>
  );
}
