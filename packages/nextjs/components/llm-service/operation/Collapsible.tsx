import {forwardRef,useState} from "react";
import Image from "next/image";


type CollapsibleProps = {
    icon: string;
    title: React.ReactNode;
    info?: React.ReactNode;
    defaultCollapsed?: boolean;
    autoScroll?: boolean;
    children: React.ReactNode;
  };
  
  const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
    function _Collapsible(
      { icon, title, children, info, defaultCollapsed = false }: CollapsibleProps,
      ref
    ) {
      const [collapsed, setCollapsed] = useState(defaultCollapsed);
      const toggle = () => setCollapsed(!collapsed);
      return (
        <div
          className={`transition-all mt-[-1px] flex min-h-[50px] justify-stretch flex-col overflow-hidden ${
            collapsed ? "flex-0 max-h-[50px]" : "flex-1"
          }`}
        >
          <div
            className="select-none flex border-y border-y-bd-1 items-center cursor-pointer min-h-[50px] h-[50px] px-6 transition-all hover:bg-bg-lt"
            onClick={toggle}
          >
            <span className="text-[20px]">{icon}</span>
            <span className="ml-4 font-medium text-[18px]">{title}</span>
            <div className="ml-auto">{info}</div>
            <div className="ml-6">
              <Image
                className={`transition-all transform ${
                  collapsed ? "" : "rotate-90 opacity-30"
                }`}
                alt="Chevron"
                src="/chevron.svg"
                height={12}
                width={6}
              />
            </div>
          </div>
          <div
            className="flex-1 overflow-auto shadow-section scroll-smooth"
            ref={ref}
          >
            {children}
          </div>
        </div>
      );
    }
  );
  export default Collapsible;