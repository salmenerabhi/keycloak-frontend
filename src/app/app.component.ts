import { Component, OnInit } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'keycloak-frontend';
  username: string | undefined;
  isLogged: boolean = false;
  isAdmin: boolean = false;

  constructor(private oauthService: OAuthService , private loginService: LoginService){
    this.configure();
  }
  ngOnInit(): void {
    
    this.configure()
       
  }

  authConfig: AuthConfig = {
    issuer: 'http://localhost:8080/auth/realms/AES',
    redirectUri: window.location.origin + '/index.html',
    clientId: 'auth-frontend',
    responseType: 'code',
    scope: 'openid profile email offline_access',
    showDebugInformation: true,
  };

  configure(): void{
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler= new NullValidationHandler();
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocument().then(()=> this.oauthService.tryLogin()).then(()=>{
      if (this.oauthService.getIdentityClaims()){
        this.isLogged = this.loginService.getIsLogged();
          this.isAdmin = this.loginService.getIsAdmin();
          type IdTokenClaims  = {
            preferred_username: string
        };
        
        const preferred_username = (this.oauthService.getIdentityClaims() as IdTokenClaims).preferred_username;

         this.username = preferred_username;
         console.log(this.oauthService.getIdentityClaims());
         
          // this.messageService.sendMessage(this.loginService.getUsername());
      }
    });
  }

  public getIsLogged():boolean {
    return (this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken());
  }

  public getIsAdmin(): boolean{
    const token= this.oauthService.getAccessToken();
    const payload= token.split('.')[1];
    const payloadDecodedJson= atob(payload);
    const payloadDecoded= JSON.parse(payloadDecodedJson);
    console.log(payloadDecoded.realm_access.roles);
    return payloadDecoded.realm_access.roles.indexOf('realm-admin')!==-1;
    
  }

  login():void{
    this.loginService.login();
  }

  logout():void{
    this.loginService.logout();
  }
}
