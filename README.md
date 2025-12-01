# EduGis - Finding the Educational Gaps

## Description
**EduGis** is the definitive data solution for comparing and mapping education access across all Canadian provinces.
It allows users to see different visualizations of the available educational facilties. This remediates the core problem of the lack of systeamtic
and geographical measure of specifc data needed for smart and strategic educational infrastructure planning.
EduGis gathers thousands of data points (location and type) from the Open Database of Educational Facilities (ODEF) and transforms them into a single legible, digestible center for information.


### Key Features
* **Geospatial Visualization:** Interactive cluster maps showing density and distribution of facilities.
* **Comparative Analytics:** Bar charts allowing for provincial and regional comparisons.
* **Data Aggregation:** Centralized processing of ODEF datasets.

## Live Demo
Access the public deployment here: **[EduGis Live Site](https://sapphire.socs.uoguelph.ca/)**

---

## Built With 
- **Data Processing/Vis:** Python (Leaflet)
- **Backend**: Java (Gradle)
- **Containerization:** Docker * Docker compose
- **Frontend**: React, Typescript

---

# Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Ensure you have the following installed on your machine:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Java JDK](https://www.oracle.com/java/technologies/downloads/) (Version 17 or higher recommended)

## Installation & Setup
### Installation & Setup
1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-repo/edugis.git](https://github.com/your-repo/edugis.git)
    cd edugis
    ```

2.  **Build the Backend**
    Navigate to the backend directory and run the Gradle build to ensure artifacts are ready.
    ```bash
    cd backend
    ./gradlew build
    cd ..
    ```

3.  **Launch with Docker**
    Start the containerized services. This will build the images and start the application.
    ```bash
    docker compose up --build
    ```
    *Note: The first run may take a few minutes as Docker downloads necessary images.*

4.  **Access the Application**
    * The application should open automatically in your default browser.
    * If not, visit: `http://localhost:8080` (or the port specified in your terminal output).

## Usage
There are two visualizations available for usage:
1. Cluster Map view
    Navigate to the "Map View" tab to view educational facilities grouped by location. Zoom in to separate the clusters into individual pins.
2. Comparative Bar Chart
    Navigate to the "Compare Facilities" tab to compare facility counts between provinces (e.g., comparing High Schools in Ontario vs. Quebec).


## Authors and acknowledgment
- Team Sapphire
- CIS*3750 F25 Team
*Data provided by the Open Database of Educational Facilities (ODEF).*

## Project status
Status: **Working and Online**