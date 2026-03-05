const AuthLayout = ({ children }) => {
  return (
    <div className="container mx-auto flex min-h-screen items-start justify-center px-4 pt-36">
      <div className="section-shell w-full max-w-md p-5 md:p-8">{children}</div>
    </div>
  );
};

export default AuthLayout;
