import { Mail, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border mt-8 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} SoccerQ — Built with ❤️</div>
        <div className="mt-1 flex items-center justify-center space-x-4">
          {/* <a href="ashwinrevi10gmail.com" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"> */}
            <div className='flex items-center space-x-1 text-muted-foreground hover:text-foreground'>
            <Mail className="h-4 w-4" />
            <span className="text-sm">ashwinrevi10@gmail.com</span>
            </div>
          {/* </a> */}
          <a href="https://github.com/AshwinR0" target="_blank" rel="noreferrer" className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
            <Github className="h-4 w-4" />
            <span className="text-sm">AshwinR0</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
