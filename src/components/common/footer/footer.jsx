import {  Fragment } from 'react';


const Footer = () => {
  return(
  <Fragment>
    <footer className="footer mt-auto xl:ps-[15rem]  font-normal font-inter bg-white text-defaultsize leading-normal text-[0.813] shadow-[0_0_0.4rem_rgba(0,0,0,0.1)] dark:bg-bodybg py-4 text-center">
    <div className="container">
        <span className="text-gray dark:text-defaulttextcolor/50"> DEVELOP BY <a
                href="https://soft-task.com/"  target='_blank' className="text-defaulttextcolor font-semibold dark:text-defaulttextcolor">SOFT TASK</a>
              
        </span>
    </div>
</footer>
  </Fragment>
);
}
export default Footer;
