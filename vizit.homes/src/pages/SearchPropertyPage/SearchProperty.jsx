import React from "react";
import {
  BottomTabs,
  Container,
  Footer,
  Head,
  ListingsCard,
  SideNav,
} from "../LandingPage/LandingPage";
import { data } from "../../data/listingdata";
// import { Header } from '../LandingPage/LandingPage'
SideNav;
BottomTabs;
Footer;
Container;

// ListingsCard
const SearchProperty = () => {
  return (
    <>
      <Head />
      <SideNav />
      <BottomTabs />
      <Container>
        <main className="main">
          <div>
            <div className="filter-property-rules">
              <h3>Filter Property</h3>
              <p>Refine Your search criteria</p>
            </div>
            <div className="listings-card-container">
              {data.map((item, index) => {
                return (
                  <ListingsCard
                    key={index}
                    id={item.listingId}
                    image={item.image}
                    title={item.title}
                    location={item.location.address}
                    rent={item.rent}
                  />
                );
              })}
            </div>
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default SearchProperty;
