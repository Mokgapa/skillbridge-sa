
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  OpportunityCard,
  Pagination,
  SearchBar,
} from "../../components";
import opportunityService from "../../services/opportunityService";
import { useDebounce } from "../../hooks/useDebounce";

const PAGE_SIZE = 9;

function getOpportunityList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.opportunities)) return response.opportunities;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.opportunities)) {
    return response.data.opportunities;
  }

  return [];
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    let active = true;

    async function loadOpportunities() {
      setLoading(true);
      setError("");

      try {
        const response = await opportunityService.getAll();
        if (active) {
          setOpportunities(getOpportunityList(response));
        }
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "We could not load opportunities. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOpportunities();

    return () => {
      active = false;
    };
  }, []);

  const filteredOpportunities = useMemo(() => {
    const searchTerm = debouncedSearch.trim().toLowerCase();
    const locationTerm = locationFilter.trim().toLowerCase();

    return opportunities.filter((item) => {
      const title = String(item.title ?? "").toLowerCase();
      const description = String(item.description ?? "").toLowerCase();
      const employer = String(
        item.company_name ??
          item.employer_name ??
          item.employer?.company_name ??
          item.employer?.name ??
          ""
      ).toLowerCase();

      const type = String(
        item.opportunity_type ?? item.type ?? ""
      ).toLowerCase();

      const location = String(item.location ?? "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        employer.includes(searchTerm);

      const matchesType =
        typeFilter === "all" ||
        type.replaceAll("_", " ") === typeFilter.replaceAll("_", " ");

      const matchesLocation =
        !locationTerm || location.includes(locationTerm);

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [opportunities, debouncedSearch, typeFilter, locationFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOpportunities.length / PAGE_SIZE)
  );

  const visibleOpportunities = filteredOpportunities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function updateSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function updateType(value) {
    setTypeFilter(value);
    setCurrentPage(1);
  }

  function updateLocation(value) {
    setLocationFilter(value);
    setCurrentPage(1);
  }

  return (
    <main className="opportunities-page section-container">
      <header className="page-heading">
        <span className="section-heading__eyebrow">
          Find your next step
        </span>
        <h1>Explore opportunities</h1>
        <p>
          Discover jobs, internships and practical experiences that can
          help you build your career.
        </p>
      </header>

      <section
        className="opportunities-filters"
        aria-label="Search and filter opportunities"
      >
        <div className="opportunities-filters__search">
          <SearchBar
            value={search}
            onChange={updateSearch}
            placeholder="Search by title, employer or keyword..."
          />
        </div>

        <div className="opportunities-filters__fields">
          <label className="form-field">
            <span className="form-field__label">Opportunity type</span>
            <select
              className="form-field__control"
              value={typeFilter}
              onChange={(event) => updateType(event.target.value)}
            >
              <option value="all">All types</option>
              <option value="job">Jobs</option>
              <option value="internship">Internships</option>
              <option value="learnership">Learnerships</option>
              <option value="micro_internship">Micro-internships</option>
              <option value="volunteer">Volunteering</option>
            </select>
          </label>

          <label className="form-field">
            <span className="form-field__label">Location</span>
            <input
              className="form-field__control"
              type="text"
              value={locationFilter}
              onChange={(event) => updateLocation(event.target.value)}
              placeholder="e.g. Johannesburg or Remote"
            />
          </label>
        </div>
      </section>

      <div className="opportunities-results__heading">
        <h2>Available opportunities</h2>
        {!loading && (
          <span>
            {filteredOpportunities.length}{" "}
            {filteredOpportunities.length === 1
              ? "opportunity"
              : "opportunities"}
          </span>
        )}
      </div>

      {loading && <LoadingSpinner />}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            setLoading(true);
            setError("");
            opportunityService
              .getAll()
              .then((response) => {
                setOpportunities(getOpportunityList(response));
              })
              .catch((err) => {
                setError(
                  err?.message || "Unable to load opportunities."
                );
              })
              .finally(() => setLoading(false));
          }}
        />
      )}

      {!loading && !error && filteredOpportunities.length === 0 && (
        <EmptyState
          title="No opportunities found"
          description="Try changing your search or filters to discover more opportunities."
          action={
            <button
              type="button"
              className="button button--secondary"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setLocationFilter("");
                setCurrentPage(1);
              }}
            >
              Clear filters
            </button>
          }
        />
      )}

      {!loading && !error && filteredOpportunities.length > 0 && (
        <>
          <div className="opportunities-grid">
            {visibleOpportunities.map((opportunity, index) => (
              <OpportunityCard
                key={
                  opportunity.opportunity_id ??
                  opportunity.id ??
                  `${opportunity.title}-${index}`
                }
                opportunity={opportunity}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <div className="opportunities-page__back">
        <Link to="/">Back to home</Link>
      </div>
    </main>
  );
}
