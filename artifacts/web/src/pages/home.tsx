import { type FormEvent, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetReviewsQueryKey, useCreateReview, useGetReviews, type Review } from '@workspace/api-client-react';
import { ArrowRight, CarFront, Check, ChevronDown, Clock3, Fuel, HeartHandshake, MapPin, Menu, MessageCircle, Navigation, Phone, ShieldCheck, Sparkles, Star, Users, X } from 'lucide-react';

type FleetFilter = 'all' | 'hatchback' | 'suv' | 'family';
type FleetVehicle = {
  id: string;
  name: string;
  type: FleetFilter;
  label: string;
  image: string;
  seats?: string;
  transmission?: string;
  fuel?: string;
  price: string;
  featured?: boolean;
};

const WHATSAPP_LINK = 'https://wa.me/918149822247?text=Hi%20Javed%20Goa%20Car%20Rental%2C%20I%27d%20like%20to%20book%20a%20car.';
const PHONE_LINK = 'tel:+918149822247';

const ratingLabels: Record<number, string> = {
  1: 'Not great',
  2: 'Could be better',
  3: 'Good',
  4: 'Loved it',
  5: 'Exceptional',
};

const fleet: FleetVehicle[] = [
  {
    id: 'creta',
    name: 'Hyundai Creta',
    type: 'suv' as const,
    label: 'Your beach-to-fort runabout',
    image: '/images/goa-hyundai-creta.jpg',
    seats: '5 seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    price: '₹3,500',
    featured: false,
  },
  {
    id: 'fronx',
    name: 'Maruti Fronx',
    type: 'suv' as const,
    label: 'Automatic crossover for every road',
    image: '/images/goa-maruti-fronx.jpg',
    seats: '5 seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    price: '₹1,700',
    featured: false,
  },
  {
    id: 'thar',
    name: 'Convertible Thar',
    type: 'suv',
    label: 'Goa adventure, open-air style',
    image: '/images/goa-thar-convertible.jpg',
    price: '₹3,500',
    featured: false,
  },
  {
    id: 'carens',
    name: 'Kia Carens',
    type: 'family',
    label: 'Comfortable space for the whole crew',
    image: '/images/goa-kia-carens.jpg',
    fuel: 'Petrol',
    price: '₹2,500',
    featured: false,
  },
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    type: 'family',
    label: 'Comfortable space for Goa road trips',
    image: '/images/goa-toyota-innova-crysta.jpg',
    price: '₹3,500',
    featured: false,
  },
  {
    id: 'baleno',
    name: 'Maruti Baleno',
    type: 'hatchback' as const,
    label: 'Easy automatic city drive',
    image: '/images/goa-maruti-baleno.jpg',
    seats: '5 seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    price: '₹1,500',
    featured: false,
  },
];

function ReviewStars({ rating, label }: { rating: number; label?: string }) {
  return (
    <div className="review-stars" aria-label={label ?? `${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={12} fill={index < rating ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FleetFilter>('all');
  const [notice, setNotice] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewLocation, setReviewLocation] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFormMessage, setReviewFormMessage] = useState('');
  const queryClient = useQueryClient();
  const { data: submittedReviews = [], isLoading: reviewsLoading } = useGetReviews();
  const createReviewMutation = useCreateReview({
    mutation: {
      onSuccess: (review) => {
        queryClient.setQueryData<Review[]>(getGetReviewsQueryKey(), (current = []) => [review, ...current]);
        queryClient.invalidateQueries({ queryKey: getGetReviewsQueryKey() });
        setReviewName('');
        setReviewLocation('');
        setReviewRating(5);
        setReviewComment('');
        setReviewFormMessage('Thanks for sharing your Goa story.');
      },
      onError: () => {
        setReviewFormMessage('We could not submit that review. Please try again.');
      },
    },
  });

  const filteredFleet = fleet.filter((car) => filter === 'all' || car.type === filter);

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReviewFormMessage('');
    createReviewMutation.mutate({
      data: {
        name: reviewName.trim(),
        location: reviewLocation.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      },
    });
  }

  function scrollToBooking(carName?: string) {
    if (carName) {
      setNotice(`${carName} selected — message Javed to check dates.`);
    }
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => setNotice(''), 4500);
  }

  return (
    <main className="site-shell">
      <div className="topline">
        <div className="topline-inner">
          <span>Local cars. Local care. All of Goa.</span>
          <a data-testid="link-top-phone" href={PHONE_LINK}><Phone size={12} /> Call Javed · +91 81498 22247</a>
        </div>
      </div>

      <section className="hero" id="home">
        <img className="hero-image" src="/images/goa-coastal-drive.jpg" alt="White SUV driving along a sunny Goa coastal road" data-testid="img-hero-coastal-drive" />
        <nav className="site-nav" aria-label="Main navigation">
          <div className="nav-inner">
            <a href="#home" className="brand-lockup" aria-label="Javed Goa Car Rental" data-testid="link-brand-home">
              <img className="brand-logo" src="/images/javed-goa-logo.png" alt="Javed Goa Car Rental" />
            </a>
            <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
              <a href="#fleet" onClick={() => setMenuOpen(false)} data-testid="link-nav-fleet">The fleet</a>
              <a href="#why-us" onClick={() => setMenuOpen(false)} data-testid="link-nav-why">Why Javed</a>
              <a href="#routes" onClick={() => setMenuOpen(false)} data-testid="link-nav-routes">Goa routes</a>
              <a href="#reviews" onClick={() => setMenuOpen(false)} data-testid="link-nav-reviews">Reviews</a>
              <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="link-nav-contact">Contact</a>
            </div>
            <a className="nav-call" href={PHONE_LINK} data-testid="link-nav-call"><Phone size={14} /> Call to book</a>
            <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)} data-testid="button-menu-toggle">
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </nav>
        <div className="hero-content">
          <div className="hero-copy">
            <div className="eyebrow">Goa, on your terms</div>
            <h1>Your holiday<br />starts <em>here.</em></h1>
            <p className="hero-lede">Clean, comfortable cars and a friendly local hand at the end of the phone. Pick up the keys and let Goa unfold.</p>
            <div className="hero-actions">
              <a className="button-primary" href="#fleet" data-testid="link-hero-fleet">See the fleet <ArrowRight size={16} /></a>
              <a className="button-ghost" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" data-testid="link-hero-whatsapp"><MessageCircle size={16} /> WhatsApp Javed</a>
            </div>
            <div className="hero-note">
              <div className="avatar-stack"><span>J</span><span>R</span><span>A</span></div>
              <span>Trusted by travellers from Mumbai to Melbourne</span>
            </div>
          </div>
        </div>
        <div className="hero-badge" aria-label="Available 7 days a week">
          <Sparkles size={89} strokeWidth={.7} />
          <span>Good cars<br />good days<br />guaranteed</span>
        </div>
      </section>

      <section className="trust-strip" aria-label="Service highlights">
        <div className="section-inner trust-list">
          <div className="trust-item" data-testid="text-trust-local"><HeartHandshake size={20} /><div><strong>Local & personal</strong><span>Real help, no call centre</span></div></div>
          <div className="trust-item" data-testid="text-trust-clean"><ShieldCheck size={20} /><div><strong>Clean & checked</strong><span>Ready for your first drive</span></div></div>
          <div className="trust-item" data-testid="text-trust-delivery"><Navigation size={20} /><div><strong>Flexible delivery</strong><span>Airport, stay or doorstep</span></div></div>
          <div className="trust-item" data-testid="text-trust-hours"><Clock3 size={20} /><div><strong>Here when you need us</strong><span>7 days, early to late</span></div></div>
        </div>
      </section>

      <section className="section" id="fleet">
        <div className="section-inner">
          <div className="fleet-head">
            <div>
              <p className="section-kicker">Choose your companion</p>
              <h2 className="section-heading">The right car for<br /><em>your Goa.</em></h2>
              <p className="section-intro">Small and nimble for old-town lanes, roomy for beach days, and always looked after like it was our own.</p>
            </div>
            <div className="fleet-filter" aria-label="Filter fleet">
              {(['all', 'hatchback', 'suv', 'family'] as FleetFilter[]).map((item) => (
                <button className={`filter-button ${filter === item ? 'active' : ''}`} key={item} onClick={() => setFilter(item)} data-testid={`button-filter-${item}`}>
                  {item === 'all' ? 'All cars' : item === 'suv' ? 'SUVs' : item[0].toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="fleet-grid">
            {filteredFleet.map((car) => (
              <article className={`fleet-card ${car.featured ? 'featured' : ''}`} key={car.id} data-testid={`card-fleet-${car.id}`}>
                <img className="car-photo" src={car.image} alt={`${car.name} available from Javed Goa Car Rental`} data-testid={`img-car-${car.id}`} />
                <div className="card-shade" />
                {car.featured && <div className="card-topline"><Sparkles size={12} /> Most loved for couples</div>}
                <div className="card-content">
                  <div className="card-meta">{car.label}</div>
                  <h3>{car.name}</h3>
                  {(car.seats || car.transmission || car.fuel) && (
                    <div className="card-specs">
                      {car.seats && <span><Users size={13} /> {car.seats}</span>}
                      {car.transmission && <span><CarFront size={13} /> {car.transmission}</span>}
                      {car.fuel && <span><Fuel size={13} /> {car.fuel}</span>}
                    </div>
                  )}
                  <div className="card-footer">
                    <div className="price">{car.price} <small>/ day</small></div>
                    <button className="reserve-link" onClick={() => scrollToBooking(car.name)} data-testid={`button-reserve-${car.id}`}>Check dates <ArrowRight size={15} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="fleet-footnote"><Check size={15} /> Every booking includes a freshly cleaned car, a full tank and a quick Goa orientation.</div>
        </div>
      </section>

      <section className="section dark-band" id="why-us">
        <div className="section-inner story-layout">
          <div className="story-art">
            <img className="story-photo" src="/images/goa-family-mpv.jpg" alt="Family car ready at a scenic Goa overlook" data-testid="img-story-family-car" />
            <div className="story-stamp"><strong>15+</strong><span>years on<br />Goa roads</span></div>
          </div>
          <div>
            <p className="section-kicker">The Javed difference</p>
            <h2 className="section-heading">The good kind<br />of <em>local.</em></h2>
            <p className="section-intro">You do not need another faceless rental desk. You need someone who knows which roads flood after rain, where to stop for the best chai, and how to get you home before the sky turns pink.</p>
            <div className="story-points">
              <div className="story-point"><span className="point-number">01</span><div><h3>A proper welcome</h3><p>We meet you where it suits — airport, hotel or homestay — and get you settled in without the paperwork fog.</p></div></div>
              <div className="story-point"><span className="point-number">02</span><div><h3>Advice that saves the day</h3><p>Ask us for a quiet beach, a monsoon-safe route or a dinner spot that locals actually return to.</p></div></div>
              <div className="story-point"><span className="point-number">03</span><div><h3>A phone number that answers</h3><p>Call or WhatsApp +91 81498 22247. A real person will get back to you — usually before your next coconut water.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section route-section" id="routes">
        <div className="section-inner route-layout">
          <div>
            <p className="section-kicker">One coast, many moods</p>
            <h2 className="section-heading">Go where<br /><em>the day takes you.</em></h2>
            <p className="section-intro">Use the car for the big sights, then take the little roads. Javed knows both.</p>
            <div className="route-chips"><span className="route-chip">Old Goa</span><span className="route-chip">Palolem</span><span className="route-chip">Fontainhas</span><span className="route-chip">Arambol</span></div>
          </div>
          <div className="route-map" aria-label="Illustrated route from North Goa to South Goa" data-testid="graphic-goa-route">
            <div className="map-line" />
            <span className="map-pin start">N</span><span className="map-label start">North Goa</span>
            <span className="map-pin end">S</span><span className="map-label end">South Goa</span>
          </div>
        </div>
      </section>

      <section className="section review-section" id="reviews">
        <div className="section-inner review-grid">
          <div className="review-intro">
            <p className="section-kicker">Words from the road</p>
            <div className="review-mark">“</div>
            <h2 className="section-heading">Arrive as<br /><em>visitors.</em><br />Leave as friends.</h2>
            <p className="section-intro">A few notes from people who chose the scenic route.</p>
          </div>
          <div className="review-content">
            <article className="review-card" data-testid="review-card-1">
              <ReviewStars rating={5} />
              <blockquote>“Javed met us at 6am with a spotless Swift and a list of breakfast places. That list alone was worth the trip.”</blockquote>
              <div className="review-author"><i className="author-dot" /> Meera & Arjun · Bengaluru</div>
            </article>
            <article className="review-card" data-testid="review-card-2">
              <ReviewStars rating={5} />
              <blockquote>“No deposit drama, no surprise charges, no waiting around. Just a great car and a very kind human.”</blockquote>
              <div className="review-author"><i className="author-dot" /> Oliver & Sophie · London</div>
            </article>
            {reviewsLoading && <div className="review-loading">Loading recent traveller notes…</div>}
            {submittedReviews.map((review) => (
              <article className="review-card submitted-review" key={review.id} data-testid={`review-card-${review.id}`}>
                <ReviewStars rating={review.rating} />
                <blockquote>“{review.comment}”</blockquote>
                <div className="review-author"><i className="author-dot" /> {review.name} · {review.location}</div>
              </article>
            ))}
            <form className="review-form" onSubmit={submitReview} data-testid="form-submit-review">
              <div className="review-form-head">
                <div>
                  <p className="section-kicker">Your turn</p>
                  <h3>How was your drive?</h3>
                </div>
                <span className="review-form-note">Takes 30 seconds</span>
              </div>
              <div className="review-rating-field">
                <span className="review-field-label">Your rating</span>
                <div className="rating-picker" role="radiogroup" aria-label="Choose a rating">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      type="button"
                      className={`rating-button ${reviewRating >= rating ? 'active' : ''}`}
                      key={rating}
                      role="radio"
                      aria-checked={reviewRating === rating}
                      aria-label={`${rating} out of 5 stars`}
                      onClick={() => setReviewRating(rating)}
                      data-testid={`button-review-rating-${rating}`}
                    >
                      <Star size={17} fill="currentColor" />
                    </button>
                  ))}
                </div>
                <span className="rating-label">{ratingLabels[reviewRating]}</span>
              </div>
              <div className="review-form-fields">
                <label>
                  Your name
                  <input value={reviewName} onChange={(event) => setReviewName(event.target.value)} minLength={2} maxLength={60} required placeholder="e.g. Priya & Karan" data-testid="input-review-name" />
                </label>
                <label>
                  Where are you from?
                  <input value={reviewLocation} onChange={(event) => setReviewLocation(event.target.value)} minLength={2} maxLength={80} required placeholder="e.g. Mumbai" data-testid="input-review-location" />
                </label>
                <label className="review-comment-field">
                  Your review
                  <textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} minLength={10} maxLength={600} required placeholder="Tell future travellers what made the trip easy." data-testid="input-review-comment" />
                </label>
              </div>
              <div className="review-form-footer">
                <span className="review-form-message" role="status" data-testid="status-review-form">{reviewFormMessage}</span>
                <button className="button-primary" type="submit" disabled={createReviewMutation.isPending} data-testid="button-submit-review">
                  {createReviewMutation.isPending ? 'Sending…' : 'Share your review'} <ArrowRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-inner contact-layout">
          <div>
            <p className="section-kicker">Ready when you are</p>
            <h2 className="section-heading">Let’s get you<br /><em>moving.</em></h2>
            <p className="contact-copy">Tell Javed your dates, number of travellers and where you are staying. He will suggest the right car and sort the rest.</p>
          </div>
          <div className="contact-actions">
            <a className="button-primary" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" data-testid="link-contact-whatsapp"><MessageCircle size={17} /> WhatsApp Javed</a>
            <a className="button-ghost" href={PHONE_LINK} data-testid="link-contact-phone"><Phone size={17} /> +91 81498 22247</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <a href="#home" className="brand-lockup" aria-label="Javed Goa Car Rental" data-testid="link-footer-home"><img className="brand-logo" src="/images/javed-goa-logo.png" alt="Javed Goa Car Rental" /></a>
          <p className="footer-note">Made for slow mornings, hidden beaches<br />and taking the long way home.</p>
          <div className="footer-links"><a href="#fleet" data-testid="link-footer-fleet">Fleet</a><a href="#why-us" data-testid="link-footer-why">Our promise</a><a href="#reviews" data-testid="link-footer-reviews">Reviews</a><a href="#contact" data-testid="link-footer-contact">Book a car</a></div>
        </div>
        <div className="footer-inner footer-bottom"><span>© 2024 Javed Goa Car Rental</span><span>Panaji · North Goa · South Goa</span></div>
      </footer>

      {notice && <div className="toast-note" role="status" data-testid="status-booking-selection"><Check size={16} /> {notice}</div>}
    </main>
  );
}

export default Home;