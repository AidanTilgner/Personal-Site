<script lang="ts">
    import Primary from "@/components/Buttons/Primary.svelte";
    import Secondary from "@/components/Buttons/Secondary.svelte";
  import Notify from "@/components/Notifcations/Notify.svelte";

    const formState = {
        name: "",
        email: "",
        message: "",
    };

    let showSuccessMessage = false;
    let messageinfo: {
        type: "success" | "error" | "info";
        text: string;
        timeout: number;
        show: boolean;
        onClose: () => void;
    } = {
        type: "success",
        text: "Your message was sent successfully!",
        timeout: 3000,
        show: false,
        onClose: () => {
            messageinfo.show = false;
        },
    };

    const validateFormState = () => {
        if (formState.name === "") {
            console.log("Validation failed");
            messageinfo = {
                type: "error",
                text: "Please enter your name",
                timeout: 3000,
                show: true,
                onClose: () => {
                    messageinfo.show = false;
                },
            };
            return false;
        }
        if (formState.email === "") {
            messageinfo = {
                type: "error",
                text: "Please enter your email",
                timeout: 3000,
                show: true,
                onClose: () => {
                    messageinfo.show = false;
                },
            };
            return false;
        }
        if (formState.message === "") {
            messageinfo = {
                type: "error",
                text: "Please enter your message",
                timeout: 3000,
                show: true,
                onClose: () => {
                    messageinfo.show = false;
                },
            };
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        if (!validateFormState()) {
          return;
        }
        console.log(formState);
        const response = await fetch("/contact/message.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formState),
        }).then((res) => {
            return res.json();
        });

        console.log("Response", response);
        messageinfo = {
            type: "success",
            text: "Your message was sent successfully!",
            timeout: 3000,
            show: true,
            onClose: () => {
                messageinfo.show = false;
            },
        };
        // formState.name = "";
        // formState.email = "";
        // formState.message = "";
    };
</script>

<main>
    <Notify
        type={messageinfo.type}
        text={messageinfo.text}
        timeout={messageinfo.timeout}
        show={messageinfo.show}
        onClose={messageinfo.onClose}
    />
    <div class="header">
      <h2 class="title">Let's <span class="accented bolder">Get in Touch</span></h2>
    </div>
    <hr />
    <div class="header-stuff">
      <a href="mailto:aidantilgner02@gmail.com">
        <Primary text="Email Me" />
      </a>
      <a href="https://calendly.com/vvibrant/client-call" target="_blank">
        <Secondary
            props={{
                text: "Let's Call",
                size: "lg"
            }}
        />
      </a>
    </div>
    <hr />
    <div class="section contact-form">
        <h3 class="subtitle">Or fill out this form</h3>
        <form on:submit={handleSubmit}>
            <div class="form-group">
                <label for="name">
                    Name 
                    <span class="required">*</span>
                </label>
                <input 
                    type="text"
                    name="name"
                    id="name"
                    bind:value={formState.name}
                    placeholder="Your name here..."
                />
            </div>
            <span class="tip">
                Your email will help us get back to you faster
            </span>
            <div class="form-group">
                <label for="email">
                    Email
                    <span class="required">*</span>
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    bind:value={formState.email}
                    placeholder="Your email here..."
                />
            </div>
            <div class="form-group">
                <label for="message">
                    Message
                    <span class="required">*</span>
                </label>
                <textarea 
                    name="message" 
                    id="message" 
                    cols="30" 
                    rows="10" 
                    bind:value={formState.message}
                    placeholder="Your message here..."
                ></textarea>
            </div>
            <div class="form-group buttons">
                <Primary>Send</Primary>
            </div>
        </form>
    </div>
</main>

<style lang="scss">
    @use "../../styles/mixins" as *;
    @use "../../styles/variables" as *;
  
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
      justify-content: center;

      @include desktop {
        flex-direction: row;
      }

      a {
        margin: 12px;

        @include desktop {
          margin: 24px;
        }
      }
    }
  
    .section {
      @include default-padding;
  
      // .subtitle {
      //   @include tablet {
      //     text-align: left;
      //   }
      // }
    }

    .contact-form {
        form {
            
            .form-group {
                margin-bottom: 24px;

                @include desktop {
                    margin-bottom: 36px;
                }

                label {
                    display: block;
                    margin-bottom: 6px;
                    text-align: left;
                    font-weight: 500;
                    font-size: 18px;
                }

                input, textarea {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 18px;
                    font-family: "Quicksand", sans-serif;
                    transition: all 0.2s ease-in-out;
                    box-sizing: border-box;
                }

                input:focus, textarea:focus {
                    border-color: $accent;
                    outline: none;
                }

            }
            
            .buttons {
                display: flex;
                justify-content: flex-end;
            }
        }

        .tip {
            display: block;
            margin-top: 12px;
            margin-bottom: 4px;
            font-size: 14px;
            font-style: italic;
            text-align: left;
            color: rgba($color: #000000, $alpha: .6);
        }
    }

    .required {
        color: $accent;
    }
</style>
  