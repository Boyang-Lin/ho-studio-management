import Container from "@/components/Container";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to Your App
          </h1>
          <p className="text-lg text-gray-600">
            Start building something amazing
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Index;