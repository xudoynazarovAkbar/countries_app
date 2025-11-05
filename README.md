# Countries App

A responsive web application to browse and search information about countries using the **REST Countries API (v3.1)**. Users can filter countries by region, search by name, and view detailed information in a modal.

---

## Features

- **Search** countries by name (partial matches allowed).
- **Filter** countries by region.
- **Responsive** design for desktop, tablet, and mobile.
- **Dark/Light Mode** toggle.
- **Country Details Modal**:
    - Flag
    - Name
    - Population
    - Region & Subregion
    - Capital
    - Top-Level Domain
    - Currencies & Languages
    - Bordering Countries
- **Loading states** for API requests.
- **No results handling** with user-friendly messages.

---

## How It Works

1. The app fetches data from the **REST Countries API**: `https://restcountries.com/v3.1/all?fields=name,flags,population,region,subregion,capital,tld,borders,languages,currencies`.
2. Users can **type in the search input** or select a **region filter**.
3. The displayed countries update dynamically based on the search/filter combination.
4. Clicking a country opens a **modal** with detailed information.

> Searching and filtering are **combined**: if a region filter is active, the search only applies to countries within that region.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/xudoynazarovAkbar/countries_app.git
