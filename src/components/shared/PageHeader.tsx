interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="relative w-full h-[200px] sm:h-[250px] mb-6">
      <img 
        src="/images/rameshwaram-cafe-hero.jpg" 
        alt="Rameshwaram Cafe" 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          Rameshwaram Cafe
        </h1>
        <p className="text-lg sm:text-xl text-white/90 font-medium">
          {title}
        </p>
      </div>
    </div>
  );
}
