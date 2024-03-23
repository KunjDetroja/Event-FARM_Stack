import React, { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "./api";
import { toast } from "react-toastify";
import Footer from "./Footer";

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const imageRefs = [useRef(), useRef(), useRef(), useRef()]; // Create refs for each image

  const [org, setOrg] = useState([]);
  const fetchorg = async () => {
    try {
      const response = await api.get("/");
      if (response.data.success !== false) {
        console.log(response.data);
        setOrg(response.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchorg();

    const testimonialIndicators = document.querySelectorAll(
      ".testimonial .indicators li"
    );
    testimonialIndicators.forEach((indicator, i) => {
      indicator.addEventListener("click", () => {
        const targetElement = document.querySelectorAll(
          ".testimonial .tabs li"
        );
        targetElement[i].classList.add("active");
        targetElement.forEach((element, index) => {
          if (index !== i) {
            element.classList.remove("active");
          }
        });
      });
    });

    const testimonialTabs = document.querySelectorAll(".testimonial .tabs li");
    testimonialTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetElement = document.querySelectorAll(
          ".testimonial .tabs li"
        );
        targetElement.forEach((element) => {
          element.classList.add("active");
        });
        targetElement.forEach((element) => {
          if (element !== tab) {
            element.classList.remove("active");
          }
        });
      });
    });

    // Code for slider section
    const paginationSpans = document.querySelectorAll(
      ".slider .swiper-pagination span"
    );
    paginationSpans.forEach((span, i) => {
      span.textContent = (i + 1).toString().padStart(2, "0");
    });

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.9, // Adjust this threshold based on your needs
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.parentElement.classList.add("visible");
        } else {
          entry.target.parentElement.classList.remove("visible");
        }
      });
    };
    const observer = new IntersectionObserver(handleIntersection, options);

    imageRefs.forEach((ref) => {
      observer.observe(ref.current);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div>
        <div>{<Navbar />}</div>
        <div class=" bg-white mb-2 homepage">
          {/* <!-- Hero Start --> */}

          <div class="position-relative p-0">
            <div class="py-5  hero-header mb-5 ml-1">
              <div class="my-5 py-5">
                <div class="row align-items-center g-5">
                  <div class="col-lg-6 text-center text-lg-start">
                    <h1 class="display-3 text-dark animated slideInLeft">
                      Enjoy Our
                      <br />
                      Seamless Services
                    </h1>
                    <p
                      class="text-info animated slideInLeft mb-4 pb-2"
                      style={{ fontSize: "1.2rem" }}
                    >
                      Explore EventWiz: Elevate Your Events! Simplify event
                      planning and participation for organizers and attendees
                      with our intuitive platform designed for seamless
                      customization and engagement.
                    </p>
                    <Link
                      to="/events"
                      class="py-sm-3 px-sm-5 me-3 animated slideInLeft"
                      style={{
                        color: "white",
                        backgroundColor: "#0e2643",
                        border: "none",
                        marginLeft: "1rem",
                        padding: "0.3rem 0.5rem 0.3rem 0.5rem",
                        borderRadius: "0.375rem",
                      }}
                    >
                      Explore Events
                    </Link>
                  </div>
                  <div class="col-lg-6 text-center text-lg-end imgbox">
                    <img
                      src="https://i.ibb.co/mFzmwKJ/eventvibe1.jpg"
                      alt="eventvibe1"
                      border="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Hero End --> */}
          {/* <!-- Service Start --> */}
          <div class="py-5">
            <div class="m-2">
              <div class="row g-4">
                <div
                  class="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.1s"
                >
                  <div class="service-item rounded pt-3">
                    <div class="p-4">
                      <i class="fa fa-3x fa-user-tie text-primary mb-4"></i>
                      <h5>Event Scheduling</h5>

                      <p>
                        Streamline event scheduling with our intuitive system,
                        ensuring efficient planning and coordination.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <div class="service-item rounded pt-3">
                    <div class="p-4">
                      <i class="fa fa-3x fa-users text-primary mb-4"></i>
                      <h5>Participant Management</h5>
                      <p>
                        Manage participants seamlessly, keeping track of
                        registrations and engagement for each event.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.5s"
                >
                  <div class="service-item rounded pt-3">
                    <div class="p-4">
                      <i class="fa fa-3x fa-comment text-primary mb-4"></i>
                      <h5>Feedback System</h5>
                      <p>
                        Enhance user experience with our feedback mechanism,
                        allowing participants to provide valuable insights.
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.7s"
                >
                  <div class="service-item rounded pt-3">
                    <div class="p-4">
                      <i class="fa fa-3x fa-headset text-primary mb-4"></i>
                      <h5>Customization Options</h5>
                      <p>
                        Tailor the platform to your needs with extensive
                        customization options for event types and user roles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Service End --> */}
          {/* <!-- About Start --> */}

          <div class="py-5 m-2">
            <div class="m-2">
              <div class="row g-5 align-items-center">
                <div class="col-lg-6">
                  <div class="row g-3">
                    <div class="col-6 text-start">
                      <img
                        class="img-fluid rounded w-100   visible"
                        ref={imageRefs[0]}
                        data-wow-delay="0.1s"
                        src="https://i.ibb.co/KK80LSD/event1.jpg"
                        alt="Event 1"
                      />
                    </div>
                    <div class="col-6 text-start">
                      <img
                        ref={imageRefs[1]}
                        class="img-fluid rounded w-75  visible"
                        data-wow-delay="0.3s"
                        src="https://i.ibb.co/yggn0zf/event1.jpg"
                        style={{ marginTop: "25%" }}
                        alt="Event 2"
                      />
                    </div>
                    <div class="col-6 text-end">
                      <img
                        ref={imageRefs[2]}
                        class="img-fluid rounded w-75  visible"
                        data-wow-delay="0.5s"
                        src="https://images.unsplash.com/photo-1535074153497-b08c5aa9c236?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d2aaf944a59f16fe1fe72f5057b3a7dd&auto=format&fit=crop&w=500&q=80"
                        alt="Event 3"
                      />
                    </div>
                    <div class="col-6 text-end">
                      <img
                        ref={imageRefs[3]}
                        class="img-fluid rounded w-100  visible"
                        data-wow-delay="0.7s"
                        src="https://i.ibb.co/T83QFyk/event1.jpg"
                        alt="Event 4"
                      />
                    </div>
                  </div>
                </div>
                <div class="col-lg-6">
                  <h5 class="section-title ff-secondary text-start text-primary fw-normal">
                    About EventWiz
                  </h5>
                  <h1 class="mb-4">
                    Welcome to{" "}
                    <i class="fa fa-calendar-alt text-primary me-2"></i>
                    EventWiz
                  </h1>
                  <p class="mb-4">
                    Elevate your event management experience with EventWiz. Our
                    platform streamlines event planning and participation,
                    providing a user-friendly interface for organizers and
                    attendees alike.
                  </p>
                  <p class="mb-4">
                    Experience seamless event scheduling, participant
                    management, a robust feedback system, and extensive
                    customization options to meet the dynamic needs of any
                    event.
                  </p>
                  <div class="row g-4 mb-4">
                    <div class="col-sm-6">
                      <div class="d-flex align-items-center border-start border-5 border-primary px-3">
                        <h1
                          class="flex-shrink-0 display-5 text-primary mb-0"
                          data-toggle="counter-up"
                        >
                          15
                        </h1>
                        <div class="ps-4">
                          <p class="mb-0">Years of</p>
                          <h6 class="text-uppercase mb-0">Experience</h6>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="d-flex align-items-center border-start border-5 border-primary px-3">
                        <h1
                          class="flex-shrink-0 display-5 text-primary mb-0"
                          data-toggle="counter-up"
                        >
                          50
                        </h1>
                        <div class="ps-4">
                          <p class="mb-0">Happy</p>
                          <h6 class="text-uppercase mb-0">Clients</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    class="btn btn-primary py-3 px-5 mt-2"
                    style={{
                      color: "white",
                      backgroundColor: "#0e2643",
                      border: "none",
                      marginLeft: "1rem",
                      padding: "0.3rem 0.5rem 0.3rem 0.5rem",
                      borderRadius: "0.375rem",
                    }}
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- About End --> */}
        </div>

        <div className="m-2 mb-5">
          <div class="container maincontainerhome h-100">
            <div class="row align-items-center h-100">
              <div class="container rounded">
                <h1 class="text-center">Featured in:</h1>
                <br />
                <div class="slider">
                  <div class="logos">
                    {org.map((org) => (
                      <img src={org.logo} className="fab" />
                    ))}
                  </div>
                  <div class="logos">
                    {org.map((org) => (
                      <img src={org.logo} className="fab" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="container">
            <div class="text-center">
              <h1>Featured Events:</h1>
            </div>
            <div class="container">
              <div class="card-columns">
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://i.ibb.co/3djZ9kD/cooking.webp"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Cooking Extravaganza</h5>
                      <p class="card-text">
                        Join us for a culinary delight! Learn the art of cooking
                        from master chefs and indulge in a flavorful experience.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Jan 20, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://images.unsplash.com/photo-1472076638602-b1f8b1ac0b4a?ixlib=rb-0.3.5&s=63c9de7246b535be56c8eaff9b87dd89&auto=format&fit=crop&w=500&q=80"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Artistic Expression Workshop</h5>
                      <p class="card-text">
                        Unleash your creativity in our artistic expression
                        workshop. Join us for an inspiring and interactive
                        event.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Jan 22, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://images.unsplash.com/photo-1535086181678-5a5c4d23aa7d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=34c86263bec2c8f74ceb74e9f4c5a5fc&auto=format&fit=crop&w=500&q=80"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Fitness and Wellness Retreat</h5>
                      <p class="card-text">
                        Rejuvenate your mind and body in our fitness and
                        wellness retreat. Join us for a day of relaxation and
                        self-care.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Jan 25, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://images.unsplash.com/photo-1535074153497-b08c5aa9c236?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d2aaf944a59f16fe1fe72f5057b3a7dd&auto=format&fit=crop&w=500&q=80"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Tech Innovation Summit</h5>
                      <p class="card-text">
                        Stay updated with the latest in technology at our Tech
                        Innovation Summit. Join industry experts for insightful
                        discussions and demos.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Jan 28, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://images.unsplash.com/photo-1535124406821-d2848dfbb25c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=98c434d75b44c9c23fc9df2a9a77d59f&auto=format&fit=crop&w=500&q=80"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Outdoor Adventure Retreat</h5>
                      <p class="card-text">
                        Embark on a thrilling outdoor adventure! Join us for a
                        retreat filled with exciting activities and breathtaking
                        landscapes.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Jan 30, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
                <div class="card">
                  <Link to="/events">
                    <img
                      class="card-img-top"
                      src="https://images.unsplash.com/photo-1508015926936-4eddcc6d4866?ixlib=rb-0.3.5&s=10b3a8717ab609be8d7786cab50c4e0b&auto=format&fit=crop&w=500&q=80"
                      alt="Card image cap"
                    />
                    <div class="card-body">
                      <h5 class="card-title">Cultural Diversity Symposium</h5>
                      <p class="card-text">
                        Explore and celebrate cultural diversity at our
                        symposium. Engage in discussions and performances that
                        showcase the richness of different cultures.
                      </p>
                      <p class="card-text">
                        <small class="text-muted">
                          <i class="fas fa-eye"></i>1000
                          <i class="far fa-user"></i>Organizer Name
                          <i class="fas fa-calendar-alt"></i>Feb 2, 2022
                        </small>
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stepsbody mt-5">
          <h1>User Reviews</h1>
          <ol>
            <li>
              <div class="title">Awesome</div>
              <div class="descr">Simplified event planning, loved it!</div>
            </li>
            <li>
              <div class="title">Effortless process</div>
              <div class="descr">Valuable insights, user-friendly</div>
            </li>
            <li>
              <div class="title">Fantastic options!</div>
              <div class="descr">
                Reliable and innovative event management solution.
              </div>
            </li>
            <li>
              <div class="title">User-friendly </div>
              <div class="descr">Made our event a success!</div>
            </li>
            <li>
              <div class="title">Invaluable feedback</div>
              <div class="descr">Improved our events!</div>
            </li>
            <li>
              <div class="title">Reliable and modern</div>
              <div class="descr">Elevated our event management!</div>
            </li>
          </ol>
        </div>

        <div className="footersection">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default HomePage;
