import { useApiPost } from "~/services/api";
import { useUserStore } from '~/stores/useUserStore'

interface LoginInterface {
  email: string;
  password: string;
}

interface RegisterInterface {
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address_id: number;
  tax_id?: number;
  bank_account?: string;
  bank_account_bic?: string;
  image?: string;
}

const userStore = useUserStore();

export const useAuth = () => {
  async function login(body: LoginInterface) {
    try {
      const res = await useApiPost("/user/login", {
        email: body.email,
        password: body.password,
      });
      userStore.user = res.data.value;
      return res.data.value;
    } catch (error) {
      console.error("error while trying to login in", error);
    }
  }

  async function registerClient(body: RegisterInterface) {
    try {
      const res = await useApiPost("/user/registerClient", {
        username: body.username,
        email: body.email,
        password: body.password,
        phone: body.phoneNumber,
        address_id: body.address_id,
        tax_id: body.tax_id,
        bank_account: body.bank_account,
        bank_account_bic: body.bank_account_bic,
        image: body.image,
      });

      return res.data;
    } catch (error) {
      console.error("error while trying to register client", error);
    }
  }

  async function registerSeller(body: RegisterInterface) {
    try {
      const res = await useApiPost("/user/registerSeller", {
        username: body.username,
        email: body.email,
        password: body.password,
        phone: body.phoneNumber,
        address_id: body.address_id,
        tax_id: body.tax_id,
        bank_account: body.bank_account,
        bank_account_bic: body.bank_account_bic,
        image: body.image,
      });

      return res.data;
    } catch (error) {
      console.error("error while trying to register seller", error);
    }
  }
  async function register(body: RegisterInterface, seller: boolean) {
    try {
      if (seller) {
        const res = await registerSeller(body);
        return res;
      } else {
        const res = await registerClient(body);
        return res;
      }
    } catch (error) {
      console.error("error while trying to register", error);
    }
  }

  return { login, register, registerClient, registerSeller };
};
