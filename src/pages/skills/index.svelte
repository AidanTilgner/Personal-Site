<script lang="ts">
    import Skill from "@/components/Cards/Skill.svelte";
    import Primary from "@/components/Buttons/Primary.svelte";
    import Resume from "../../assets/files/aidan-tilgner-resume.pdf";
</script>

<main>
  <div class="header">
    <h2 class="title">My <span class="accented bolder">Skills</span></h2>
  </div>
  <hr />
  <div class="header-stuff">
    <a href={Resume} download>
        <Primary download>
            My Resume
        </Primary>
    </a>
  </div>
  <hr />
  <div class="section frontend">
    <h3 class="subtitle">Frontend</h3>
    <div class="skills">
      <Skill
        props={{
          title: "React",
          description: `
              A <span class="accented bolder">popular</span> and <span class="accented bolder">highly supported</span> frontend framework
              for building <span class="accented bolder">high quality user interfaces</span>.
            `,
          icon: {
            name: "blue-react-icon",
            type: "custom",
            href: "https://reactjs.org/",
          },
          endpoint: "/projects?skill=react",
          border: {
            color: "#3d6eff",
            caption: "Most Used",
          },
        }}
      />
      <Skill
        props={{
          title: "Svelte",
          description: `
              A <span class="accented bolder">lighting</span> fast, <span class="accented bolder">reactive</span> framework for building
              <span class="accented bolder">web apps</span> with excellent <span class="accented bolder">developer</span>
              and <span class="accented bolder">user experiences</span>.
            `,
          icon: {
            name: "blue-svelte-icon",
            type: "custom",
            href: "https://svelte.dev/",
          },
          endpoint: "/projects?skill=svelte",
          border: {
            color: "#3d6eff",
            caption: "Most Loved",
          },
        }}
      />
      <Skill
        props={{
          title: "Astro",
          description: `
                Astro is an <span class="accented bolder">all-in-one</span> web framework for building
                <span class="accented bolder">fast</span>, <span class="accented bolder">content-focused</span> websites.
            `,
          icon: {
            name: "blue-astro-icon",
            type: "custom",
            href: "https://astro.build/",
          },
          endpoint: "/projects?skill=astro",
          // border: {
          //   color: "#3d6eff",
          //   caption: "Most Experience",
          // },
        }}
      />
      <Skill
          props={{
            title: "TypeScript",
            description: `
            A strongly typed superset of <span class="accented bolder">JavaScript</span> that
            allows for <span class="accented bolder">better maintainability</span> and <span class="accented bolder">reusability</span> of code.
            `,
            icon: {
              name: "blue-ts-icon",
              type: "custom",
              href: "https://www.typescriptlang.org/",
            },
            endpoint: "/projects?skill=typescript",
            // border: {
            //   color: "#3d6eff",
            //   caption: "Personal Favorite",
            // },
          }}
        />
    </div>
  </div>
  <hr />
  <div class="section backend">
    <h3 class="subtitle">Backend</h3>
    <div class="skills">
        <Skill
          props={{
            title: "Golang",
            description: `
              A <span class="accented bolder">highly performant</span> compiled programming language
              that is use to build <span class="accented bolder">scalable</span> and 
              <span class="accented bolder">reliable</span> software.
          `,
            icon: {
              name: "blue-golang-icon",
              type: "custom",
              href: "https://go.dev/",
            },
            endpoint: "/projects?skill=golang",
            border: {
              color: "#3d6eff",
              caption: "Most Promising",
            },
          }}
        />
        <Skill
            props={{
              title: "TypeScript",
              description: `
              A strongly typed superset of <span class="accented bolder">JavaScript</span> that
              allows for <span class="accented bolder">better maintainability</span> and <span class="accented bolder">reusability</span> of code.
              `,
              icon: {
                name: "blue-ts-icon",
                type: "custom",
                href: "https://www.typescriptlang.org/",
              },
              endpoint: "/projects?skill=typescript",
              // border: {
              //   color: "#3d6eff",
              //   caption: "Personal Favorite",
              // },
            }}
        />
        <Skill
            props={{
                title: "Laravel",
                description: `
                Based around the <span class="accented bolder">MVC pattern</span>, Laravel is a PHP web framework designed for the development of
                <span class="accented bolder">data intensive</span> and <span class="accented bolder">scalable</span> web applications.
                `,
                icon: {
                    name: "blue-laravel-icon",
                    type: "custom",
                    href: "https://laravel.com/",
                },
                endpoint: "/projects?skill=laravel",
                border: {
                  color: "#3d6eff",
                  caption: "Highly Used",
                },
            }}
        />
        <Skill
            props={{
                title: "Express",
                description: `
                A <span class="accented bolder">fast</span>, <span class="accented bolder">unopinionated</span>,
                <span class="accented bolder">minimalist</span> web framework. Mostly used for <span class="accented bolder">API development</span>
                with <span class="accented bolder">TypeScript</span>.
                `,
                icon: {
                    name: "blue-express-icon",
                    type: "custom",
                    href: "https://expressjs.com/",
                },
                endpoint: "/projects?skill=express",
                border: {
                    color: "#3d6eff",
                    caption: "Highly Used",
                },
            }}
        />
        <Skill
            props={{
                title: "Node.js",
                description: `
                    As an <span class="accented bolder">asynchronous</span>, <span class="accented bolder">event-driven</span>
                    <span class="accented bolder">JavaScript/TypeScript</span> runtime, Node.js is designed to build 
                    <span class="accented bolder">scalable</span> network applications.
                `,
                icon: {
                    name: "blue-nodejs-icon",
                    type: "custom",
                    href: "https://nodejs.org/en/",
                },
                endpoint: "/projects?skill=nodejs",
                border: {
                    color: "#3d6eff",
                    caption: "Highly Used",
                },
            }}
        />
        <Skill
            props={{
                title: "Python",
                description: `
                    A <span class="accented bolder">high-level</span>, <span class="accented bolder">interpreted</span>,
                    <span class="accented bolder">object-oriented</span> programming language. Python is used for
                    <span class="accented bolder">scripting</span>, <span class="accented bolder">automation</span>, and
                    <span class="accented bolder">data science</span>.
                `,
                icon: {
                    name: "blue-python-icon",
                    type: "custom",
                    href: "https://www.python.org/about/",
                },
                endpoint: "/projects?skill=python",
                // border: {
                //     color: "#3d6eff",
                //     caption: "Highly Used",
                // },
            }}
        />
    </div>
  </div>
  <hr />
  <div class="section databases">
    <h3 class="subtitle">Databases</h3>
    <div class="skills">
        <Skill
            props={{
                title: "MySQL",
                // marketing pitch for mysql
                description: `
                    A <span class="accented bolder">relational</span> database management system (RDBMS) that is
                    <span class="accented bolder">open-source</span> and <span class="accented bolder">cross-platform</span>.
                `,
                icon: {
                    name: "blue-mysql-icon",
                    type: "custom",
                    href: "https://www.mysql.com/about/",
                },
                endpoint: "/projects?skill=mysql",
                // border: {
                //     color: "#3d6eff",
                //     caption: "Highly Used",
                // },
            }}
        />
        <Skill
            props={{
                title: "SurrealDB",
                description: `
                    With an <span class="accented bolder">SQL-style</span> query language, <span class="accented bolder">real-time</span> queries with
                    highly-efficient related data retrieval, SurrealDB is the next generation serverless database.
                `,
                icon: {
                    name: "blue-surrealdb-icon",
                    type: "custom",
                    href: "https://surrealdb.com/",
                },
                endpoint: "/projects?skill=surrealdb",
                border: {
                    color: "#3d6eff",
                    caption: "Personal Favorite",
                },
            }}
        />
        <Skill
            props={{
                title: "MongoDB",
                // marketing pitch for mongodb
                description: `
                    A <span class="accented bolder">document-oriented</span> database management system (DBMS) that is
                    <span class="accented bolder">open-source</span> and <span class="accented bolder">cross-platform</span>.
                `,
                icon: {
                    name: "blue-mongodb-icon",
                    type: "custom",
                    href: "https://www.mongodb.com/",
                },
                endpoint: "/projects?skill=mongodb",
                // border: {
                //     color: "#3d6eff",
                //     caption: "Personal Favorite",
                // },
            }}
        />
    </div>
  </div>
  <hr />
  <div class="section design">
    <h3 class="subtitle">Design</h3>
    <div class="skills">
        <Skill
            props={{
                title: "Figma",
                // marketing pitch for figma
                description: `
                    A <span class="accented bolder">collaborative</span>, <span class="accented bolder">vector-based</span> design tool that is
                    <span class="accented bolder">cloud-based</span> and <span class="accented bolder">cross-platform</span>.
                `,
                icon: {
                    name: "blue-figma-icon",
                    type: "custom",
                    href: "https://www.figma.com/about/",
                },
                endpoint: "/projects?skill=figma",
                // border: {
                //     color: "#3d6eff",
                //     caption: "Personal Favorite",
                // },
            }}
        />
    </div>
  </div>
</main>

<style lang="scss">
  @use "../../styles/mixins" as *;

  main {
    padding-block-end: 56px;
  }

  .header {
    margin: 36px 0;
  }

  .header-stuff {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .section {
    @include default-padding;

    .subtitle {
      @include tablet {
        text-align: left;
      }
    }

    .skills {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      grid-gap: 36px;
      margin-top: 24px;

      @include tablet {
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 36px;
        margin-top: 36px;
      }
    }
  }
</style>
